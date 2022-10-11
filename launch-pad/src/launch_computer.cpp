#include "launch_computer.h"

LaunchComputer::LaunchComputer()
{
}

bool LaunchComputer::setup(Config *config, Leds *leds)
{
    this->_leds = leds;
    this->_config = config;

    return true;
}

void LaunchComputer::update()
{
}