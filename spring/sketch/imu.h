#ifndef _IMU_H
#define _IMU_H

#include <Arduino.h>
#include <Wire.h>
#include <SimpleKalmanFilter.h>

#include "vec3f.h"
#include "stats.h"
#include "config.h"
#include "mpu_6050.h"
#include "madgwick.h"
#include "qmc_5883l.h"
#include "quaternion.h"
#include "status_leds.h"

class IMU
{
public:
  IMU();

  bool setup(Config *config, Stats *stats, StatusLeds *status_leds);
  void update();

  Vec3f *get_rotation();
  Vec3f *get_gyroscope();
  Vec3f *get_acceleration();
  Vec3f *get_magnetometer();
  Quaternion *get_orientation();
  Vec3f *get_world_acceleration();
  Vec3f *get_world_acceleration_normalized();
  Vec3f *get_world_kalman_acceleration_normalized();

private:
  MPU6050 _mpu_6050;
  Madgwick _madgwick;
  QMC5883L _qmc_5883l;

  Quaternion _q;
  Quaternion _orientation;

  Vec3f _rotation;
  Vec3f _world_acceleration;
  Vec3f _world_acceleration_normalized;
  Vec3f _world_kalman_acceleration_normalized;

  SimpleKalmanFilter *_kalman_acceleration_x;
  SimpleKalmanFilter *_kalman_acceleration_y;
  SimpleKalmanFilter *_kalman_acceleration_z;

  TwoWire *_wire;

  Stats *_stats;
  Config *_config;
  StatusLeds *_status_leds;
};

#endif // _IMU_H
