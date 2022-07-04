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

    // get the acceleration pointing z based on orientation
    Vec3f z_acceleration = this->_rotation.multiply_vec(*acceleration);

    Vec3f frame_acceleration = this->_orientation.multiply_vec(z_acceleration);

    frame_acceleration.z += -2.0 * GRAVITY_OF_EARTH;

    Vec3f _world_acceleration = this->_orientation.inverse().multiply_vec(frame_acceleration);

    /* // make the gravity_z
     Vec3f gravity_z(0.0, 0.0, -2.0 * GRAVITY_OF_EARTH);

     Vec3f v = this->_rotation.inverse().multiply_vec(gravity_z);
     z_acceleration = z_acceleration.add(v);

     // calculate acceleration back to world using invere orientation
     Vec3f _world_acceleration = this->_raw_orientation.inverse().multiply_vec(z_acceleration);*/

    this->_world_acceleration = _world_acceleration; // this->_rotation.multiply_vec(_world_acceleration);

    return true;
}

void IMU::set_rotation(Quaternion rotation)
{
    this->_rotation = rotation;
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