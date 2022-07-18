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
    void update();

    void abort();
    void unlock();

    Vec3f *get_velocity();
    FlightComputerState get_state();

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

    void terminating();
    void idle();

    // utils
    void set_state(FlightComputerState state);
    void update_thrust_velocity();
    void update_freefall_velocity();
    void update_flight_termination();

    bool _launched;
    int _landed_orientation_counter;

    uint32_t _launch_time;
    uint32_t _landed_orientation_timer;

    Vec3f _velocity;
    Vec3f _last_orientation;

    FlightComputerState _state;

    IMU *_imu;
    Stats *_stats;
    Print *_print;
    FlightComputerConfig *_config;
    FlightComputerEventHandler *_handler;
};

#endif // _FLIGHT_COMPUTER_H