#ifndef _PARACHUTE_MANAGER_H
#define _PARACHUTE_MANAGER_H

#include <Arduino.h>
#include <ESP32Servo.h>

#include "../utils/leds.h"
#include "../config/config.h"

class ParachuteManager
{
public:
    ParachuteManager();

    bool setup(Config *config, LEDs *leds);
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

    bool _trigger;

    bool _completed;

    bool _velocity;
    bool _altitude;
    bool _orientation;

    uint32_t _timer;

    LEDs *_leds;
    Servo _servo;
    Config *_config;
};

#endif // _PARACHUTE_MANAGER_H
