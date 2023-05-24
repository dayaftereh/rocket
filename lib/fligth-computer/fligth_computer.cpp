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
    this->_launch_time = 0;
    this->_velocity = this->_velocity.set(0.0, 0.0, 0.0);
    this->_last_orientation = this->_last_orientation.set(0.0, 0.0, 0.0);

    this->_landed_orientation_timer = 0;
    this->_landed_orientation_counter = 0;

    this->_state = FLIGHT_COMPUTER_LOCKED;

    return true;
}

void FlightComputer::update()
{
    // check if launched
    if (this->_launched)
    {
        // check if the flight is terminated
        this->update_flight_termination();
    }

    switch (this->_state)
    {
    case FLIGHT_COMPUTER_LOCKED:
        this->locked();
        break;
    case FLIGHT_COMPUTER_INIT:
        this->init();
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
    case FLIGHT_COMPUTER_TERMINATING:
        this->terminating();
        break;
    case FLIGHT_COMPUTER_IDLE:
        this->idle();
        break;
    }
}

void FlightComputer::locked()
{
    // call handler locked
    this->_handler->locked();
}

void FlightComputer::init()
{
    // call handler init
    bool done = this->_handler->init();
    
    // check if rocket has initialized
    if (done)
    {
        // change to startup
        this->set_state(FLIGHT_COMPUTER_STARTUP);
    }
}

void FlightComputer::startup()
{
    // set the flight computer to startup
    this->_launched = false;
    // set launch time to zero
    this->_launch_time = 0;
    // reset last orientation
    this->_last_orientation = this->_last_orientation.set(0.0, 0.0, 0.0);
    // reset current _velocity
    this->_velocity = this->_velocity.set(0.0, 0.0, 0.0);
    // call handler startup
    this->_handler->startup();

    // change to wait for launch
    this->set_state(FLIGHT_COMPUTER_WAIT_FOR_LAUNCH);
}

void FlightComputer::wait_for_launch()
{
    // check if launch acceleration detected
    Vec3f *acceleration = this->_imu->get_zeroed_acceleration_filtered();
    // check if the acceleration above the threshold
    if (acceleration->length() < this->_config->launch_acceleration_threshold)
    {
        return;
    }
    // update the thrust velocity
    this->update_thrust_velocity();
    // set computer to launched

    // change to launched
    this->set_state(FLIGHT_COMPUTER_LAUNCHED);
}

void FlightComputer::launched()
{
    // update the thrust velocity
    this->update_thrust_velocity();
    // set launched to true
    this->_launched = true;
    // mark the launch time
    this->_launch_time = millis();
    // call handler launched
    this->_handler->launched();
    // wait for lift off
    this->set_state(FLIGHT_COMPUTER_WAIT_FOR_LIFT_OFF);
}

void FlightComputer::wait_for_lift_off()
{
    // update the thrust velocity
    this->update_thrust_velocity();

    // check if lift off velocity reached
    if (this->_velocity.length() < this->_config->lift_off_velocity_threshold)
    {
        return;
    }

    // change to lift off
    this->set_state(FLIGHT_COMPUTER_LIFT_OFF);
}

void FlightComputer::lift_off()
{
    // update the thrust velocity
    this->update_thrust_velocity();
    // call handler launched
    this->_handler->lift_off();
    // change to wait for meco
    this->set_state(FLIGHT_COMPUTER_WAIT_FOR_MECO);
}

void FlightComputer::wait_for_meco()
{
    // update the thrust velocity
    this->update_thrust_velocity();
    // check for meco (main engine cutoff)
    Vec3f *acceleration = this->_imu->get_zeroed_acceleration_filtered();
    if (acceleration->length() > this->_config->meco_acceleration_threshold)
    {
        return;
    }
    // change to meco
    this->set_state(FLIGHT_COMPUTER_MECO);
}

void FlightComputer::meco()
{
    // update the velocity with freefall, because meco
    this->update_freefall_velocity();
    // call handler meco
    this->_handler->meco();
    // change to coasting, because rocket has still velocity
    this->set_state(FLIGHT_COMPUTER_COASTING);
}

void FlightComputer::coasting()
{
    // update the velocity for freefall
    this->update_freefall_velocity();
    // check if still z velocity available
    if (this->_velocity.z > this->_config->apogee_velocity_threshold)
    {
        return;
    }
    // if not apogee reached
    this->set_state(FLIGHT_COMPUTER_APOGEE);
}

void FlightComputer::apogee()
{
    // update the velocity for freefall
    this->update_freefall_velocity();
    // call handler apogee
    this->_handler->apogee();
    // reset the orientation counter
    this->_landed_orientation_counter = 0;
    // reset the last orientation
    this->_last_orientation = this->_last_orientation.set(0.0, 0.0, 0.0);
    // set now wait for landing
    this->set_state(FLIGHT_COMPUTER_WAIT_FOR_LANDED);
}

void FlightComputer::wait_for_landed()
{
    // update the velocity for freefall
    this->update_freefall_velocity();

    // check if only gravity is acting
    Vec3f *acceleration = this->_imu->get_zeroed_acceleration_filtered();
    if (acceleration->length() > this->_config->landed_acceleration_threshold)
    {
        // reset the orientation counter, because acceleration hit
        this->_landed_orientation_counter = 0;
        return;
    }

    // get current rocket orientation
    Quaternion *orientation = this->_imu->get_orientation();
    // calculate current rotation in degree
    Vec3f rotation = orientation->get_euler().scale_scalar(RAD_TO_DEG);
    // calculate the orientation delta
    Vec3f rotation_delta = this->_last_orientation.subtract(rotation);
    // update last orientation
    this->_last_orientation = rotation;
    // get orientation changed
    float length = rotation_delta.length();

    // check if the orientation has changed
    if (length > this->_config->landed_orientation_threshold)
    {
        // reset the counter, because orientation changed too much
        this->_landed_orientation_counter = 0;
        return;
    }

    // increment the counter
    this->_landed_orientation_counter++;
    // check if counter reached max readings
    if (this->_landed_orientation_counter < this->_config->landed_orientation_count)
    {
        return;
    }

    // check if no changes detected
    if (this->_landed_orientation_counter == this->_config->landed_orientation_count)
    {
        // start the timer
        this->_landed_orientation_timer = millis();
        return;
    }

    // check if the landed orientation timer exceeded
    uint32_t delta = millis() - this->_landed_orientation_timer;
    if (delta < this->_config->landed_change_detect_timeout)
    {
        return;
    }

    // set now to landed
    this->set_state(FLIGHT_COMPUTER_LANDED);
}

void FlightComputer::landed()
{
    // set launched to false
    this->_launched = false;
    // call handler landed
    this->_handler->landed();
    // change to idle, because rocket is done
    this->set_state(FLIGHT_COMPUTER_IDLE);
}

void FlightComputer::terminating()
{
    // set launched to false
    this->_launched = false;
    // call handler terminated
    this->_handler->terminated();
    // change to idle, because rocket is done
    this->set_state(FLIGHT_COMPUTER_IDLE);
}

void FlightComputer::idle()
{
    // call handler idle
    this->_handler->idle();
}

void FlightComputer::update_flight_termination()
{
    // check if flight timeout
    uint32_t delta = millis() - this->_launch_time;
    if (delta < this->_config->flight_terminate_timeout)
    {
        return;
    }

    // abort and change to terminating
    this->set_state(FLIGHT_COMPUTER_TERMINATING);
}

void FlightComputer::abort()
{
    // abort and change to terminating
    this->set_state(FLIGHT_COMPUTER_TERMINATING);
}

void FlightComputer::unlock()
{
    // set rocket to init
    this->set_state(FLIGHT_COMPUTER_INIT);
}

void FlightComputer::update_thrust_velocity()
{
    // get dt from last update
    float delta = this->_stats->get_delta();
    // get zeroed acceleration, because rocket thrust and cancel gravity out
    Vec3f *acceleration = this->_imu->get_zeroed_acceleration_filtered();
    // sum up the velocity by v1 = v0 + a * t
    Vec3f v = acceleration->scale_scalar(delta);
    this->_velocity = this->_velocity.add(v);
}

void FlightComputer::update_freefall_velocity()
{
    // get dt from last update
    float delta = this->_stats->get_delta();

    // get now world acceleration including gravity, because rocket is in free fall
    Vec3f *acceleration = this->_imu->get_world_acceleration_filtered();
    // sum up the velocity by v1 = v0 + a * t
    Vec3f v = acceleration->scale_scalar(delta);
    this->_velocity = this->_velocity.add(v);
}

bool FlightComputer::is_launched()
{
    return this->_launched;
}

uint32_t FlightComputer::get_inflight_time()
{
    if (!this->_launched)
    {
        return 0;
    }
    return millis() - this->_launch_time;
}

Vec3f *FlightComputer::get_velocity()
{
    return &this->_velocity;
}

FlightComputerState FlightComputer::get_state()
{
    return this->_state;
}

void FlightComputer::set_state(FlightComputerState state)
{
    this->_print->print("changing flight computer state from [ ");
    this->_print->print(this->_state);
    this->_print->print(" ] to [ ");
    this->_print->print(state);
    this->_print->println(" ]");

    this->_state = state;
}