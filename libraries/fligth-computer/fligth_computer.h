#ifndef _FLIGHT_COMPUTER_H
#define _FLIGHT_COMPUTER_H

#include <Print.h>
#include <Arduino.h>

#include "imu.h"
#include "vec3f.h"
#include "stats.h"
#include "fligth_computer_state.h"
#include "fligth_computer_config.h"
#include "fligth_computer_event_handler.h"

class FlightComputer
{
public:
    FlightComputer();

    bool setup(FlightComputerConfig *config, FlightComputerEventHandler *handler, IMU *imu, Stats *stats, Print *print);

    unlock();

    FlightComputerState get_state();

    void update();

private:

    // states
    void locked();
    void startup();

    void wait_for_launch();
    void launched();

    void wait_for_lift_off();
    void lift_off();

    void wait_for_meco();
    void meco();

    void coasting();
    void apogee();

    void wait_for_landed();
    void landed();

    void idle();

    // utils
    void update_thrust_velocity();
    void update_freefall_velocity();

    bool _launched;    
    uint32_t _launch_time;

    Vec3f _velocity;

    FlightComputerState _state;

    IMU *_imu;
    Stats *_stats;
    Print *_print;
    FlightComputerConfig *_config;
    FlightComputerEventHandler *_handler;
};

#endif // _FLIGHT_COMPUTER_H