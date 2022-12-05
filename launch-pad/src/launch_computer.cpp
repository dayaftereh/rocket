#include "launch_computer.h"

LaunchComputer::LaunchComputer()
{
}

bool LaunchComputer::setup(Config *config, Rocket *rocket, Leds *leds, Print *print)
{
    this->_leds = leds;
    this->_print = print;
    this->_rocket = rocket;
    this->_config = config;

    return true;
}

void LaunchComputer::rocket_status(bool error, int state)
{
}

void LaunchComputer::start()
{
}

void LaunchComputer::abort()
{
}

void LaunchComputer::update()
{
}