#include "parachute_manager.h"

ParachuteManager::ParachuteManager()
{
}

bool ParachuteManager::setup(ParachuteManagerConfig *config, Print *print)
{
    this->_print = print;
    this->_config = config;

    this->_print->print("setup parachute manager with [ channel: ");
    this->_print->print(this->_config->parachute_channel);
    this->_print->print(", frequency: ");
    this->_print->print(this->_config->parachute_frequency);
    this->_print->print(", pin: ");
    this->_print->print(this->_config->parachute_pin);
    this->_print->print(" ]");

    // setup the channel from config for the LEDC
    uint32_t frequency = ledcSetup(this->_config->parachute_channel, this->_config->parachute_frequency, 16);
    if (frequency == 0)
    {
        return false;
    }

    // attache the pin to the channel
    ledcAttachPin(this->_config->parachute_pin, this->_config->parachute_channel);

    return true;
}

void ParachuteManager::open()
{
    ledcWrite(this->_config->parachute_channel, this->_config->parachute_open_duty);
}

void ParachuteManager::close()
{
    ledcWrite(this->_config->parachute_channel, this->_config->parachute_close_duty);
}
