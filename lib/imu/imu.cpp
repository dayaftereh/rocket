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

    this->_acceleration_x.set_tunings(0.1, 0.01);
    this->_acceleration_y.set_tunings(0.1, 0.01);
    this->_acceleration_z.set_tunings(0.1, 0.01);

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

    // use the kalman to filter the acceleration
    this->_acceleration_filtered.x = this->_acceleration_x.update_estimate(raw_acceleration.x);
    this->_acceleration_filtered.y = this->_acceleration_y.update_estimate(raw_acceleration.y);
    this->_acceleration_filtered.z = this->_acceleration_z.update_estimate(raw_acceleration.z);

    // calculate the z frame orientation acceleration based on the _raw_orientation
    Vec3f frame_acceleration = this->_raw_orientation.multiply_vec(this->_acceleration_filtered);
    Vec3f raw_frame_acceleration = this->_raw_orientation.multiply_vec(raw_acceleration);

    // subtract the the gravity
    frame_acceleration.z -= GRAVITY_OF_EARTH;
    raw_frame_acceleration.z -= GRAVITY_OF_EARTH;

    // calculate back the zero acceleration without the rotation
    Vec3f zero_acceleration = this->_raw_orientation.inverse().multiply_vec(frame_acceleration);
    Vec3f raw_zero_acceleration = this->_raw_orientation.inverse().multiply_vec(raw_frame_acceleration);

    // apply now the given rotation for zero acceleration
    this->_zeroed_acceleration = this->_rotation.inverse().multiply_vec(raw_zero_acceleration);
    this->_zeroed_acceleration_filtered = this->_rotation.inverse().multiply_vec(zero_acceleration);

    // subtract the the gravity agen for the world acceleration
    frame_acceleration.z -= GRAVITY_OF_EARTH;
    raw_frame_acceleration.z -= GRAVITY_OF_EARTH;

    // calculate back the world acceleration without the rotation
    Vec3f world_acceleration = this->_raw_orientation.inverse().multiply_vec(frame_acceleration);
    Vec3f raw_world_acceleration = this->_raw_orientation.inverse().multiply_vec(raw_frame_acceleration);

    // apply now the given rotation for zero acceleration
    this->_world_acceleration = this->_rotation.inverse().multiply_vec(raw_world_acceleration);
    this->_world_acceleration_filtered = this->_rotation.inverse().multiply_vec(world_acceleration);

    return true;
}

void IMU::set_rotation(Quaternion &rotation)
{
    this->_rotation = rotation;
}

void IMU::set_filter_tunings(float mea, float p)
{
    this->_acceleration_x.set_tunings(mea, p);
    this->_acceleration_y.set_tunings(mea, p);
    this->_acceleration_z.set_tunings(mea, p);
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

Vec3f *IMU::get_zeroed_acceleration()
{
    return &this->_zeroed_acceleration;
}

Vec3f *IMU::get_zeroed_acceleration_filtered()
{
    return &this->_zeroed_acceleration_filtered;
}

Vec3f *IMU::get_gyroscope()
{
    return this->_gyroscope->get_gyroscope();
}

Vec3f *IMU::get_acceleration()
{
    return this->_acceleration->get_acceleration();
}

Vec3f *IMU::get_acceleration_filtered()
{
    return &this->_acceleration_filtered;
}

Vec3f *IMU::get_magnetometer()
{
    return this->_magnetometer->get_magnetometer();
}