#ifndef _LOOP_CONTROLLER_H
#define _LOOP_CONTROLLER_H

#include <imu.h>
#include <leds.h>
#include <Print.h>
#include <Arduino.h>
#include <status_leds.h>
#include <data_logger.h>
#include <fligth_computer.h>

#include "io.h"
#include "config.h"
#include "data_log_entry.h"

class RocketController : public FlightComputerEventHandler
{
public:
    RocketController();

    bool setup(IMU *imu, FlightComputer *flight_computer, DataLogger *data_logger, IO *io, StatusLeds *leds, Stats *stats, Print *print);
    bool update();

    // flight computer
    void locked();
    bool init();
    void startup();
    void launched();
    void lift_off();
    void meco();
    void apogee();
    void landed();
    void terminated();
    void idle();

private:
    bool write_data_log_entry();

    bool _first_update;
    uint32_t _startup_timer;

    IO *_io;
    IMU *_imu;
    Stats *_stats;
    Print *_print;
    StatusLeds *_leds;
    DataLogger *_data_logger;
    FlightComputer *_flight_computer;
};
#endif // _LOOP_CONTROLLER_H