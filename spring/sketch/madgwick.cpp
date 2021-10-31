#include "madgwick.h"

Madgwick::Madgwick()
{
}

bool Madgwick::setup(Config *config)
{
    this->_config = config;

    this->_kP = 2.0;
    this->_kI = 0.005;
    this->_half_T = 0.5f;

    return true;
}

void Madgwick::update(float gx, float gy, float gz, float ax, float ay, float az, float mx, float my, float mz)
{
    float norm;
    float hx, hy, hz, bx, bz;
    float vx, vy, vz, wx, wy, wz;
    float ex, ey, ez;

    float q0 = this->_q.w;
    float q1 = this->_q.x;
    float q2 = this->_q.y;
    float q3 = this->_q.z;

    // auxiliary variables to reduce number of repeated operations
    float q0q0 = q0 * q0;
    float q0q1 = q0 * q1;
    float q0q2 = q0 * q2;
    float q0q3 = q0 * q3;
    float q1q1 = q1 * q1;
    float q1q2 = q1 * q2;
    float q1q3 = q1 * q3;
    float q2q2 = q2 * q2;
    float q2q3 = q2 * q3;
    float q3q3 = q3 * q3;

    // normalise the measurements
    norm = sqrt(ax * ax + ay * ay + az * az);
    ax = ax / norm;
    ay = ay / norm;
    az = az / norm;
    norm = sqrt(mx * mx + my * my + mz * mz);
    mx = mx / norm;
    my = my / norm;
    mz = mz / norm;

    // compute reference direction of flux
    hx = 2 * mx * (0.5 - q2q2 - q3q3) + 2 * my * (q1q2 - q0q3) + 2 * mz * (q1q3 + q0q2);
    hy = 2 * mx * (q1q2 + q0q3) + 2 * my * (0.5 - q1q1 - q3q3) + 2 * mz * (q2q3 - q0q1);
    hz = 2 * mx * (q1q3 - q0q2) + 2 * my * (q2q3 + q0q1) + 2 * mz * (0.5 - q1q1 - q2q2);
    bx = sqrt((hx * hx) + (hy * hy));
    bz = hz;

    // estimated direction of gravity and flux (v and w)
    vx = 2 * (q1q3 - q0q2);
    vy = 2 * (q0q1 + q2q3);
    vz = q0q0 - q1q1 - q2q2 + q3q3;
    wx = 2 * bx * (0.5 - q2q2 - q3q3) + 2 * bz * (q1q3 - q0q2);
    wy = 2 * bx * (q1q2 - q0q3) + 2 * bz * (q0q1 + q2q3);
    wz = 2 * bx * (q0q2 + q1q3) + 2 * bz * (0.5 - q1q1 - q2q2);

    // error is sum of cross product between reference direction of fields and direction measured by sensors
    ex = (ay * vz - az * vy) + (my * wz - mz * wy);
    ey = (az * vx - ax * vz) + (mz * wx - mx * wz);
    ez = (ax * vy - ay * vx) + (mx * wy - my * wx);

    // integral error scaled integral gain
    this->_integral_error.x = this->_integral_error.x + ex * this->_kI;
    this->_integral_error.y = this->_integral_error.y + ey * this->_kI;
    this->_integral_error.z = this->_integral_error.z + ez * this->_kI;

    // adjusted gyroscope measurements
    gx = gx + this->_kP * ex + this->_integral_error.x;
    gy = gy + this->_kP * ey + this->_integral_error.y;
    gz = gz + this->_kP * ez + this->_integral_error.z;

    // integrate quaternion rate and normalise
    q0 = q0 + (-q1 * gx - q2 * gy - q3 * gz) * this->_half_T;
    q1 = q1 + (q0 * gx + q2 * gz - q3 * gy) * this->_half_T;
    q2 = q2 + (q0 * gy - q1 * gz + q3 * gx) * this->_half_T;
    q3 = q3 + (q0 * gz + q1 * gy - q2 * gx) * this->_half_T;

    // normalise quaternion
    norm = sqrt(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3);
    this->_q.w = q0 / norm;
    this->_q.x = q1 / norm;
    this->_q.y = q2 / norm;
    this->_q.z = q3 / norm;
}

Quaternion *Madgwick::get_quaternion()
{
    return &this->_q;
}