#include "fligth_computer.h"

FlightComputer::FlightComputer()
{
}

bool FlightComputer::setup(FlightComputerConfig *config, FlightComputerEventHandler *handler, IMU *imu, Stats *stats, Print *print)
{
    this->_imu = imu;
    this->_stats = stats;
    this->_print = print;
    this->_config = config;
    this->_handler = handler;

    this->_launched = false;
    this->_state = FLIGHT_COMPUTER_LOCKED;

    return true;
}

void FlightComputer::update()
{
    switch (this->_state)
    {
    case FLIGHT_COMPUTER_LOCKED:
        this->locked();
        break;
    case FLIGHT_COMPUTER_STARTUP:
        this->startup();
        break;
    case FLIGHT_COMPUTER_WAIT_FOR_LAUNCH:
        this->wait_for_launch();
        break;
    case FLIGHT_COMPUTER_LAUNCHED:
        this->launched();
        break;
    case FLIGHT_COMPUTER_WAIT_FOR_LIFT_OFF:
        this->wait_for_lift_off();
        break;
    case FLIGHT_COMPUTER_LIFT_OFF:
        this->lift_off();
        break;
    case FLIGHT_COMPUTER_WAIT_FOR_MECO:
        this->wait_for_meco();
        break;
    case FLIGHT_COMPUTER_MECO:
        this->meco();
        break;
    case FLIGHT_COMPUTER_COASTING:
        this->coasting();
        break;
    case FLIGHT_COMPUTER_APOGEE:
        this->apogee();
        break;
    case FLIGHT_COMPUTER_WAIT_FOR_LANDED:
        this->wait_for_landed();
        break;
    case FLIGHT_COMPUTER_LANDED:
        this->landed();
        break;
    case FLIGHT_COMPUTER_IDLE:
        this->idle();
        break;
    }
}

void FlightComputer::locked()
{
    this->_handler->locked();
}

void FlightComputer::startup()
{
    this->_launched = false;
    this->_launch_time = 0;
    this->_velocity = this->_velocity.set(0.0, 0.0, 0.0);

    this->_handler->startup();
    this->_state = FLIGHT_COMPUTER_WAIT_FOR_LAUNCH;
}

void FlightComputer::wait_for_launch()
{
    // check if launch acceleration detected
    Vec3f *acceleration = this->_imu->get_zeroed_acceleration_filtered();
    if (acceleration->length() < this->_config->launch_acceleration_threshold)
    {
        return;
    }

    this->update_thrust_velocity();
    this->_state = FLIGHT_COMPUTER_LAUNCHED;
}

void FlightComputer::launched()
{
    this->update_thrust_velocity();

    this->_launched = true;
    this->_launch_time = millis();

    this->_handler->launched();
    this->_state = FLIGHT_COMPUTER_WAIT_FOR_LIFT_OFF;
}

void FlightComputer::wait_for_lift_off()
{
    this->update_thrust_velocity();

    // check if lift off velocity reached
    if (this->_velocity.length() < this->_config->.lift_off_velocity_threshold)
    {
        return;
    }

    this->_state = FLIGHT_COMPUTER_LIFT_OFF;
}

void FlightComputer::lift_off()
{
    this->update_thrust_velocity();

    this->_handler->lift_off();
    this->_state = FLIGHT_COMPUTER_WAIT_FOR_MECO;
}

void FlightComputer::wait_for_meco()
{
    this->update_thrust_velocity();
    // check for meco
    Vec3f *acceleration = this->_imu->get_zeroed_acceleration_filtered();
    if (acceleration->length() > this->_config->meco_acceleration_threshold)
    {
        return;
    }

    this->_state = FLIGHT_COMPUTER_MECO;
}

void FlightComputer::meco()
{
    this->update_freefall_velocity();

    this->_handler->meco();

    this->_state = FLIGHT_COMPUTER_COASTING;
}

void FlightComputer::coasting()
{
    this->update_freefall_velocity();
    // check if still z velocity available
    if (this->_velocity.z > 0.0)
    {
        return;
    }
}