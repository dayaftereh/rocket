#ifndef _TVC_H
#define _TVC_H

#include <Arduino.h>
#include <ESP32Servo.h>

#include "../imu/imu.h"
#include "../utils/leds.h"
#include "../config/config.h"

class TVC
{
public:
    TVC();

    bool setup(Config *config, LEDs *leds, IMU *imu);

    void enable();
    void disable();

    void update();

private:
    bool _enabled;

    Servo _x;
    Servo _y;

    IMU *_imu;
    LEDs *_leds;
    Config *_config;
};

#endif // _TVC_H
