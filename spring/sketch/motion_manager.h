#ifndef _MOTION_MANAGER_H
#define _MOTION_MANAGER_H

#include <Arduino.h>
#include <Wire.h>

#include "vec3f.h"
#include "stats.h"
#include "config.h"
#include "mpu_6050.h"
#include "madgwick.h"
#include "qmc_5883l.h"
#include "quaternion.h"
#include "status_leds.h"

class MotionManager
{
public:
  MotionManager();

  bool setup(Config *config, Stats *stats, StatusLeds *status_leds);
  void update();

  Vec3f *get_rotation();
  Vec3f *get_gyroscope();
  Vec3f *get_acceleration();
  Vec3f *get_magnetometer();

private:
  MPU6050 _mpu_6050;
  Madgwick _madgwick;
  QMC5883L _qmc_5883l;

  Vec3f _rotation;

  TwoWire *_wire;

  Stats *_stats;
  Config *_config;
  StatusLeds *_status_leds;
};

#endif // _MOTION_MANAGER_H
