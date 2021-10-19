#ifndef _MOTION_MANAGER_H
#define _MOTION_MANAGER_H

#include <MPU6050.h>
#include <Arduino.h>
#include <helper_3dmath.h>

#include "stats.h"
#include "config.h"
#include "status_leds.h"

class MotionManager
{
  public:
    MotionManager();

    bool setup(Config *config, Stats *stats, StatusLeds *status_leds);
    void update();

    VectorFloat *get_gyroscope();
    VectorFloat *get_acceleration();
    VectorFloat *get_world_rotaion();
    Quaternion *get_world_orientation();
    
  private:

    void read();
    void warmup();
    void update_world_rotation();
    void update_world_orientation();

    float get_gyroscope_scale();
    float get_acceleromete_scale();

    MPU6050 *_mpu6050;

    Stats *_stats;
    Config *_config;
    StatusLeds *_status_leds;

    VectorFloat _gyroscope;
    VectorFloat _acceleration;
    VectorFloat _world_rotaion;

    Quaternion _world_orientation;
};

#endif // _MOTION_MANAGER_H
