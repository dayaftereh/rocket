#include "launch_computer.h"

LaunchComputer::LaunchComputer()
{
}

bool LaunchComputer::setup(Config *config, IO *io, Rocket *rocket, Leds *leds, Stats *stats, Print *print)
{
    this->_io = io;
    this->_leds = leds;
    this->_stats = stats;
    this->_print = print;
    this->_rocket = rocket;
    this->_config = config;

    this->_timer = 0.0;
    this->_last_rocket_state = -1;
    this->_last_rocket_signal = 0;

    this->_state = LAUNCH_COMPUTER_LOCKED;

    return true;
}

void LaunchComputer::rocket_status(bool error, int state)
{
    if (error)
    {
        // move to abort for rocket error
        this->_state = LAUNCH_COMPUTER_ABORT_ROCKET_ERROR;
        return;
    }
    // update the last rocket state
    this->_last_rocket_state = state;
    // mark the last signal from the rocket
    this->_last_rocket_signal = millis();
}

void LaunchComputer::start()
{
    // move the launch computer in startup
    this->_state = LAUNCH_COMPUTER_STARTUP;
}

void LaunchComputer::abort()
{
    // move the launch computer to abort by user
    this->_state = LAUNCH_COMPUTER_ABORT_BY_USER;
}

void LaunchComputer::update()
{
    // update the current state
    switch (this->_state)
    {
    case LAUNCH_COMPUTER_LOCKED:
        this->locked();
        break;

    case LAUNCH_COMPUTER_STARTUP:
        this->startup();
        break;

    case LAUNCH_COMPUTER_WAIT_FOR_ROCKET:
        this->wait_for_rocket();
        break;

    case LAUNCH_COMPUTER_PRESSURISING:
        this->pressurising();
        break;
    case LAUNCH_COMPUTER_WAIT_FOR_PRESSURE:
        this->wait_for_pressure();
        break;

    case LAUNCH_COMPUTER_WAIT_TANK_CHILL:
        this->wait_tank_chill();
        break;

    case LAUNCH_COMPUTER_ROCKET_STARTUP:
        this->rocket_startup();
        break;
    case LAUNCH_COMPUTER_WAIT_ROCKET_STARTUP:
        this->wait_for_rocket_startup();
        break;

    case LAUNCH_COMPUTER_LAUNCH_COUNTDOWN:
        this->launch_countdown();
        break;
    case LAUNCH_COMPUTER_LAUNCH:
        this->launch();
        break;

    case LAUNCH_COMPUTER_WAIT_LIFT_OFF:
        this->wait_lift_off();
        break;

    case LAUNCH_COMPUTER_ABORT_BY_USER:
        this->abort_by_user();
        break;
    case LAUNCH_COMPUTER_ABORT_AFTER_LAUNCH:
        this->abort_after_launch();
        break;
    case LAUNCH_COMPUTER_ABORT_ROCKET_ERROR:
        this->abort_rocket_error();
        break;
    case LAUNCH_COMPUTER_ABORT_CONNECTION_LOST:
        this->abort_connection_lost();
        break;
    }
}

void LaunchComputer::locked()
{
    this->_timer = 0.0;
}

void LaunchComputer::startup()
{
    this->_timer += this->_stats->get_delta();
    if (this->_timer < this->_config->startup_timeout)
    {
        return;
    }

    this->_timer = 0.0;
    // reset rocket state and signal to check if the rocket is connected
    this->_last_rocket_state = -1;
    this->_last_rocket_signal = 0;

    this->_state = LAUNCH_COMPUTER_WAIT_FOR_ROCKET;
}

void LaunchComputer::wait_for_rocket()
{
    // update the connecting timer for timeout
    this->_timer += this->_stats->get_delta();

    // check if the connecting timeout is reached
    if (this->_timer > this->_config->rocket_connecting_timeout)
    {
        this->_state = LAUNCH_COMPUTER_ABORT_CONNECTION_LOST;
        return;
    }

    // check if start state of the rocket is set
    if (this->_last_rocket_state != this->_config->rocket_connected_state)
    {
        return;
    }
    // calculate the elapsed time from the last signal of the rocket
    float elapsed = float(millis() - this->_last_rocket_signal) / 1000.0;
    // check singal in threshold
    if (elapsed > this->_config->rocket_signal_elapsed_threshold)
    {
        return;
    }

    this->_timer = 0.0;
    // move next state, because rocket connected
    this->_state = LAUNCH_COMPUTER_PRESSURISING;
}

void LaunchComputer::pressurising()
{
    // check if the rocket is connected
    bool ok = this->verify_rocket_connected();
    if (!ok)
    {
        return;
    }

    this->_timer = 0.0;
    this->_state = LAUNCH_COMPUTER_WAIT_FOR_PRESSURE;
}

void LaunchComputer::wait_for_pressure()
{
    // check if the rocket is connected
    bool ok = this->verify_rocket_connected();
    if (!ok)
    {
        return;
    }

    this->_timer += this->_stats->get_delta();
    if (this->_timer > this->_config->pressurising_timeout)
    {
        this->_state = LAUNCH_COMPUTER_ABORT_PRESSURISING_TIMEOUT;
        return;
    }

    // get the current pressure
    float pressure = this->_io->get_pressure();
    // check if target pressure reached
    if (pressure < this->_config->target_pressure)
    {
        return;
    }

    this->_timer = 0.0;
    this->_state = LAUNCH_COMPUTER_WAIT_TANK_CHILL;
}

void LaunchComputer::wait_tank_chill()
{
    bool ok = this->verify_pressure_and_rocket_connected();
    if (!ok)
    {
        return;
    }

    this->_timer += this->_stats->get_delta();
    if (this->_timer < this->_config->start_window_timeout)
    {
        return;
    }

    this->_timer = 0.0;
    this->_state = LAUNCH_COMPUTER_ROCKET_STARTUP;
}

void LaunchComputer::rocket_startup()
{
    bool ok = this->verify_pressure_and_rocket_connected();
    if (!ok)
    {
        return;
    }
    // unlock the rocket and bring in startup
    this->_rocket->rocket_unlock();

    this->_timer = 0.0;
    this->_state = LAUNCH_COMPUTER_WAIT_ROCKET_STARTUP;
}

void LaunchComputer::wait_for_rocket_startup()
{
    bool ok = this->verify_pressure_and_rocket_connected();
    if (!ok)
    {
        return;
    }

    this->_timer += this->_stats->get_delta();
    if (this->_timer > this->_config->rocket_startup_timeout)
    {
        this->_state = LAUNCH_COMPUTER_ABORT_ROCKET_STARTUP_TIMEOUT;
        return;
    }

    // check if startup state reached
    if (this->_last_rocket_state != this->_config->rocket_startup_state)
    {
        return;
    }

    this->_timer = 0.0;
    this->_state = LAUNCH_COMPUTER_LAUNCH_COUNTDOWN;
}