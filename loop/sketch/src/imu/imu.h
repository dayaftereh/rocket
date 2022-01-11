#ifndef _IMU_H
#define _IMU_H

#include <Arduino.h>
#include <Wire.h>

#include "mpu_6050.h"
#include "madgwick.h"
#include "hmc_5883l.h"

#include "../utils/leds.h"
#include "../utils/stats.h"

#include "../math/vec3f.h"
#include "../config/config.h"
#include "../math/quaternion.h"

class IMU
{
public:
  IMU();

  bool setup(Config *config, Stats *stats, LEDs *leds);
  void update();

  Vec3f *get_rotation();
  Vec3f *get_gyroscope();
  Vec3f *get_acceleration();
  Vec3f *get_magnetometer();
  Quaternion *get_orientation();
  Vec3f *get_world_acceleration();
  Vec3f *get_world_acceleration_normalized();

private:
  MPU6050 _mpu_6050;
  Madgwick _madgwick;
  HMC5883L _hmc_5883l;

  Quaternion _q;
  Quaternion _orientation;

  Vec3f _rotation;
  Vec3f _world_acceleration;
  Vec3f _world_acceleration_normalized;

  TwoWire *_wire;

  LEDs *_leds;
  Stats *_stats;
  Config *_config;
};

#endif // _IMU_H
