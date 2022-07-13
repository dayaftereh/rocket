#include "imu.h"

IMU::IMU()
{
}

bool IMU::setup(Gyroscope *gyroscope, Acceleration *acceleration, Magnetometer *magnetometer, Madgwick *madgwick, Print *print)
{
    this->_print = print;
    this->_madgwick = madgwick;
    this->_gyroscope = gyroscope;
    this->_magnetometer = magnetometer;
    this->_acceleration = acceleration;

    this->_world_acceleration_x.set_tunings(0.1, 0.01);
    this->_world_acceleration_y.set_tunings(0.1, 0.01);
    this->_world_acceleration_z.set_tunings(0.1, 0.01);

    return true;
}

bool IMU::update()
{
    Vec3f *gyroscope = this->_gyroscope->get_gyroscope();
    Vec3f *acceleration = this->_acceleration->get_acceleration();
    Vec3f *magnetometer = this->_magnetometer->get_magnetometer();

    // check if all sensors give valid values
    if (gyroscope->length() < ZERO_EPSILON || magnetometer->length() < ZERO_EPSILON || magnetometer->length() < ZERO_EPSILON)
    {
        return true;
    }

    // make gyroscope back to rad
    Vec3f gyro_rad = gyroscope->scale_scalar(DEG_TO_RAD);

    // update the madgwick
    this->_madgwick->update(
        gyro_rad.x, gyro_rad.y, gyro_rad.z,
        acceleration->x, acceleration->y, acceleration->z,
        magnetometer->x, magnetometer->y, magnetometer->z);

    // get the euler rotation
    Quaternion *raw = this->_madgwick->get_quaternion();
    // set the raw orientation
    this->_raw_orientation = raw->clone();
    // calculate the orientation
    this->_orientation = this->_raw_orientation.multiply(this->_rotation);

    // get the raw acceleration
    Vec3f raw_acceleration = acceleration->clone();
    // calculate the z frame orientation acceleration based on the _raw_orientation
    Vec3f frame_acceleration = this->_raw_orientation.multiply_vec(raw_acceleration);
    // subtract the twice the gravity
    frame_acceleration.z += -2.0 * GRAVITY_OF_EARTH;
    // calculate back the raw world acceleration without the rortation
    Vec3f raw_world_acceleration = this->_raw_orientation.inverse().multiply_vec(frame_acceleration);
    // apply now the given rotation
    this->_world_acceleration = this->_rotation.inverse().multiply_vec(raw_world_acceleration);

    // use the kalman to filter the acceleration
    this->_world_acceleration_filtered.x = this->_world_acceleration_x.update_estimate(this->_world_acceleration.x);
    this->_world_acceleration_filtered.y = this->_world_acceleration_y.update_estimate(this->_world_acceleration.y);
    this->_world_acceleration_filtered.z = this->_world_acceleration_z.update_estimate(this->_world_acceleration.z);

    return true;
}

void IMU::set_rotation(Quaternion &rotation)
{
    this->_rotation = rotation;
}

void IMU::set_filter_tunings(float mea, float p)
{
    this->_world_acceleration_x.set_tunings(mea, p);
    this->_world_acceleration_y.set_tunings(mea, p);
    this->_world_acceleration_z.set_tunings(mea, p);
}

Quaternion *IMU::get_raw_orientation()
{
    return &this->_raw_orientation;
}

Quaternion *IMU::get_orientation()
{
    return &this->_orientation;
}

Vec3f *IMU::get_world_acceleration()
{
    return &this->_world_acceleration;
}

Vec3f *IMU::get_world_acceleration_filtered()
{
    return &this->_world_acceleration_filtered;
}

Vec3f *IMU::get_gyroscope()
{
    return this->_gyroscope->get_gyroscope();
}

Vec3f *IMU::get_acceleration()
{
    return this->_acceleration->get_acceleration();
}

Vec3f *IMU::get_magnetometer()
{
    return this->_magnetometer->get_magnetometer();
}