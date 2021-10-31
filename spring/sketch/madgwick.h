#ifndef _MADWICK_H
#define _MADWICK_H

#include <math.h>

#include "vec3f.h"
#include "config.h"
#include "quaternion.h"

//=====================================================================================================
// Description:
//
// Quaternion implementation of the 'DCM filter' [Mayhony et al].  Incorporates the magnetic distortion
// compensation algorithms from my filter [Madgwick] which eliminates the need for a reference
// direction of flux (bx bz) to be predefined and limits the effect of magnetic distortions to yaw
// axis only.
//
// User must define 'halfT' as the (sample period / 2), and the filter gains 'Kp' and 'Ki'.
//
// Global variables 'q0', 'q1', 'q2', 'q3' are the quaternion elements representing the estimated
// orientation.  See my report for an overview of the use of quaternions in this application.
//
// User must call 'update()' every sample period and parse calibrated gyroscope ('gx', 'gy', 'gz'),
// accelerometer ('ax', 'ay', 'ay') and magnetometer ('mx', 'my', 'mz') data.  Gyroscope units are
// radians/second, accelerometer and magnetometer units are irrelevant as the vector is normalised.
//
//=====================================================================================================

class Madgwick
{
public:
    Madgwick();

    bool setup(Config *config);

    void update(float gx, float gy, float gz, float ax, float ay, float az, float mx, float my, float mz);

    Quaternion *get_quaternion();

private:
    float _kP; // proportional gain governs rate of convergence to accelerometer/magnetometer
    float _kI; // integral gain governs rate of convergence of gyroscope biases
    float _half_T; // half the sample period

    Quaternion _q;
    Vec3f _integral_error; // scaled integral error

    Config *_config;
};

#endif // _MADWICK_H
