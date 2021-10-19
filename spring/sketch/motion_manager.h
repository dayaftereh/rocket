#ifndef _MOTION_MANAGER_H
#define _MOTION_MANAGER_H

#include <MPU6050.h>

#include "config.h"

class MotionManager
{
  public:
    MotionManager();

    bool setup();
    void update();

  private:
  
    int16_t _ax;
    int16_t _ay;
    int16_t _az;
    int16_t _gx;
    int16_t _gy;
    int16_t _gz;

    MPU6050 *_mpu6050;
};

#endif // _MOTION_MANAGER_H
