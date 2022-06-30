#ifndef _IMU_H
#define _IMU_H

#include <Print.h>
#include <Arduino.h>

#include "madgwick.h"
#include "constants.h"
#include "gyroscope.h"
#include "quaternion.h"
#include "magnetometer.h"
#include "acceleration.h"

class IMU
{
public:
    IMU();

    bool setup(Gyroscope *gyroscope, Acceleration *acceleration, Magnetometer *magnetometer, Madgwick *madgwick, Print *print);

    bool update();

    void set_rotation(Quaternion rotation);

    Vec3f *get_world_acceleration();

    Quaternion *get_orientation();
    Quaternion *get_raw_orientation();

private:
    Vec3f _world_acceleration;

    Quaternion _rotation;
    Quaternion _orientation;
    Quaternion _raw_orientation;

    Print *_print;
    Madgwick *_madgwick;
    Gyroscope *_gyroscope;
    Acceleration *_acceleration;
    Magnetometer *_magnetometer;
};

#endif // _LEDS_H