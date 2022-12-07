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

    void locked();

    void startup();
    void wait_for_rocket();

    void pressurising();
    void wait_for_pressure();

    void wait_tank_chill();

    void rocket_startup();
    void wait_rocket_startup();

    void launch_countdown();
    void launch();

    void wait_lift_off();

    void abort_after_launch();
    void abort_rocket_error();
    void abort_connection_lost();

    Leds *_leds;
    Print *_print;
    Rocket *_rocket;
    Config *_config;
};

#endif // _LAUNCH_COMPUTER_H