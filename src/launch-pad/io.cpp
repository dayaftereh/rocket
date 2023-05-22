#include "io.h"

IO::IO()
{
}

bool IO::setup(Config *config, Stats *stats, Print *print)
{
    this->_stats = stats;
    this->_print = print;
    this->_config = config;

    // configure the pin modes
    pinMode(HONK_PIN, OUTPUT);
    pinMode(ABORT_VALVE_PIN, OUTPUT);
    pinMode(LAUNCH_VALVE_PIN, OUTPUT);

    this->_honk = false;
    this->_abort = false;
    this->_launch = false;

    // write the starting states
    digitalWrite(HONK_PIN, this->_honk);
    digitalWrite(ABORT_VALVE_PIN, this->_abort);
    digitalWrite(LAUNCH_VALVE_PIN, this->_launch);

    return true;
}

void IO::honk()
{
    this->_honk = true;
    this->_honk_timer = 0.0;
}

void IO::abort_valve()
{
    this->_abort = true;
}

void IO::launch_valve()
{
    this->_launch = true;
    this->_launch_timer = 0.0;
}

float IO::get_voltage()
{
    return this->_voltage;
}

float IO::get_pressure()
{
    return this->_pressure;
}

void IO::update()
{
    // read and calculate the current voltage
    float raw_voltage = (float)analogRead(VOLTAGE_PIN);
    this->_voltage = raw_voltage * this->_config->voltage_factor + this->_config->voltage_offset;

    // read and calculate the current pressure
    float raw_pressure = (float)analogRead(PRESSURE_PIN);
    this->_pressure = raw_pressure * this->_config->pressure_factor + this->_config->pressure_offset;

    this->update_honk();
    this->update_abort();
    this->update_launch();
}

void IO::update_honk()
{
    // update the honk pin
    digitalWrite(HONK_PIN, this->_honk);

    if (!this->_honk)
    {
        return;
    }

    // update the honk timer
    this->_honk_timer += this->_stats->get_delta();

    // check if the honk duration is reached
    this->_honk = this->_honk_timer < this->_config->honk_duration;
}

void IO::update_abort()
{
    // update the abort valve pin
    digitalWrite(ABORT_VALVE_PIN, this->_abort);

    if (!this->_abort)
    {
        return;
    }

    // check if pressure threshold is reached
    this->_abort = this->_pressure > this->_config->abort_close_pressure_threshold;
}

void IO::update_launch()
{
    // update the launch valve pin
    digitalWrite(LAUNCH_VALVE_PIN, this->_launch);

    if (!this->_launch)
    {
        return;
    }

    // update the launch timer to let the valve open
    this->_launch_timer += this->_stats->get_delta();

    // check if the launch valve open duration is reached
    this->_launch = this->_launch_timer < this->_config->launch_valve_opened_duration;
}