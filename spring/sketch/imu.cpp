#include "imu.h"

IMU::IMU()
{
}

bool IMU::setup(Config *config, Stats *stats, StatusLeds *status_leds)
{
  this->_stats = stats;
  this->_config = config;
  this->_status_leds = status_leds;

  TwoWire *wire = &Wire;

  this->_kalman_acceleration_x = new SimpleKalmanFilter(2.0, 2.0, 0.001);
  this->_kalman_acceleration_y = new SimpleKalmanFilter(2.0, 2.0, 0.001);
  this->_kalman_acceleration_z = new SimpleKalmanFilter(2.0, 2.0, 0.001);

  this->_q.set_euler(
      this->_config->rotation_x * DEG_2_RAD,
      this->_config->rotation_y * DEG_2_RAD,
      this->_config->rotation_z * DEG_2_RAD);

  bool success = this->_madgwick.setup(config, stats);
  if (!success)
  {
    Serial.println("fail to initialize madgwick");
    return false;
  }

  success = this->_mpu_6050.setup(config, wire, status_leds);
  if (!success)
  {
    Serial.println("fail to setup mpu6050");
    return false;
  }

  delay(10);

  this->_status_leds->progress();

  success = this->_qmc_5883l.setup(config, wire, status_leds);
  if (!success)
  {
    Serial.println("fail to setup qmc5883l");
    return false;
  }

  return true;
}

void IMU::update()
{
  // read the new data from sensors
  this->_mpu_6050.update();
  this->_qmc_5883l.update();

  Vec3f *gyroscope = this->_mpu_6050.get_gyroscope();
  Vec3f *acceleration = this->_mpu_6050.get_acceleration();
  Vec3f *magnetometer = this->_qmc_5883l.get_magnetometer();

  // convert to gyro
  Vec3f gyro = gyroscope->scale_scalar(DEG_2_RAD);

  // update madgwick
  this->_madgwick.update(
      gyro.x, gyro.y, gyro.z,
      acceleration->x, acceleration->y, acceleration->z,
      magnetometer->x, magnetometer->y, magnetometer->z);

  // get the current rotation as Quaternion
  Quaternion *q = this->_madgwick.get_quaternion();
  Quaternion q1 = q->clone();
  this->_orientation = q1.multiply(this->_q);

  // calculate the rotation
  this->_rotation = this->_orientation.get_euler().scale_scalar(RAD_2_DEG);

  // get the world acceleration
  Vec3f v = acceleration->clone();
  v = q1.multiply_vec(v).invert();
  this->_world_acceleration = v;

  // calculate world acceleration normalized
  v = this->_world_acceleration.clone();
  // add the world gravity
  v.z += GRAVITY_OF_EARTH;
  // invert becaue
  v = v.invert();
  // remove the world gravity
  // v.z -= GRAVITY_OF_EARTH;
  this->_world_acceleration_normalized = v;
 
  this->_world_kalman_acceleration_normalized.x = this->_kalman_acceleration_x->updateEstimate(v.x);
  this->_world_kalman_acceleration_normalized.y = this->_kalman_acceleration_y->updateEstimate(v.y);
  this->_world_kalman_acceleration_normalized.z = this->_kalman_acceleration_z->updateEstimate(v.z);
}

Vec3f *IMU::get_rotation()
{
  return &this->_rotation;
}

Vec3f *IMU::get_magnetometer()
{
  return this->_qmc_5883l.get_magnetometer();
}

Vec3f *IMU::get_gyroscope()
{
  return this->_mpu_6050.get_gyroscope();
}

Vec3f *IMU::get_acceleration()
{
  return this->_mpu_6050.get_acceleration();
}

Vec3f *IMU::get_world_acceleration()
{
  return &this->_world_acceleration;
}

Quaternion *IMU::get_orientation()
{
  return &this->_orientation;
}

Vec3f *IMU::get_world_acceleration_normalized()
{
  return &this->_world_acceleration_normalized;
}

Vec3f *IMU::get_world_kalman_acceleration_normalized() {
  return &this->_world_kalman_acceleration_normalized;
}