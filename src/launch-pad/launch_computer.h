#ifndef _LAUNCH_COMPUTER_H
#define _LAUNCH_COMPUTER_H

#include <leds.h>
#include <stats.h>
#include <Print.h>

#include "io.h"
#include "config.h"
#include "rocket.h"
#include "launch_computer_state.h"

class LaunchComputer
{
public:
    LaunchComputer();

    bool setup(Config *config, IO *io, Rocket *rocket, Leds *leds, Stats *stats, Print *print);

    void abort();
    void start();

    void rocket_status(bool error, int state);

    void update();

private:
    // steps
    void locked();

    void startup();
    void wait_for_rocket();

    void pressurising();
    void wait_for_pressure();

    void wait_tank_chill();

    void rocket_startup();
    void wait_for_rocket_startup();

    void launch_countdown();
    void launch();

    void wait_lift_off();

    void abort_by_user();
    void abort_after_launch();
    void abort_rocket_error();
    void abort_connection_lost();

    // utils
    bool verify_rocket_connected();
    bool verify_pressure_and_rocket_connected();

    float _timer;
    float _countdown;

    int _last_rocket_state;
    
    uint32_t _last_rocket_signal;

    LaunchComputerState _state;

    IO *_io;
    Leds *_leds;
    Stats *_stats;
    Print *_print;
    Rocket *_rocket;
    Config *_config;
};

#endif // _LAUNCH_COMPUTER_H