#ifndef _IMU_H
#define _IMU_H

#include <Print.h>
#include <Arduino.h>

#include "kalman.h"
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

    void set_rotation(Quaternion &rotation);
    void set_filter_tunings(float mea, float p);

    Vec3f *get_world_acceleration();
    Vec3f *get_world_acceleration_filtered();

    Quaternion *get_orientation();
    Quaternion *get_raw_orientation();

private:
    Vec3f _world_acceleration;
    Vec3f _world_acceleration_filtered;

    Kalman _world_acceleration_x;
    Kalman _world_acceleration_y;
    Kalman _world_acceleration_z;

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