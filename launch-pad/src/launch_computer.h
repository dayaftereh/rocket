#ifndef _LAUNCH_COMPUTER_H
#define _LAUNCH_COMPUTER_H

#include <leds.h>
#include <Print.h>

#include "config.h"
#include "rocket.h"
#include "launch_computer_state.h"

class LaunchComputer
{
public:
    LaunchComputer();

    bool setup(Config *config, Rocket *rocket, Leds *leds, Print *print);
    void update();

    void abort();
    void start();

    void rocket_status(bool error, int state);

private:
    Leds *_leds;
    Print *_print;
    Rocket *_rocket;
    Config *_config;
};

#endif // _LAUNCH_COMPUTER_H