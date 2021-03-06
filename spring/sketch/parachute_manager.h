#ifndef _PARACHUTE_MANAGER_H
#define _PARACHUTE_MANAGER_H

#include <Servo.h>
#include <Arduino.h>

#include "config.h"
#include "status_leds.h"

class ParachuteManager
{
public:
    ParachuteManager();

    bool setup(Config *config, StatusLeds *status_leds);
    void update();

    void open();
    void close();
    void trigger();

    void velocity_trigger();
    void altitude_trigger();
    void orientation_trigger();

    bool is_velocity_triggered();
    bool is_altitude_triggered();
    bool is_orientation_triggered();

private:
    void reset();

    bool _open;
    bool _trigger;
    
    bool _completed;

    bool _velocity;
    bool _altitude;
    bool _orientation;

    unsigned long _timer;

    Servo _servo;
    Config *_config;
    StatusLeds *_status_leds;
};

#endif // _PARACHUTE_MANAGER_H
