#ifndef _CONFIG_H
#define _CONFIG_H

#include <Arduino.h>

#define RED_LED_PIN 2
#define GREEN_LED_PIN 4

#define MADGWICK_KI (0.0)
#define MADGWICK_KP (15.0)

#define ACCELERATION_X_OFFSET (-0.5)
#define ACCELERATION_Y_OFFSET (0.0)
#define ACCELERATION_Z_OFFSET (-2.6)

#define IMU_X_ROTATION (DEG_TO_RAD * -75.1)
#define IMU_Y_ROTATION (DEG_TO_RAD * 4.3)
#define IMU_Z_ROTATION (DEG_TO_RAD * 0)

#endif // _CONFIG_H