#ifndef _MOTION_MANAGER_H
#define _MOTION_MANAGER_H

#include <Arduino.h>
#include <Wire.h>

#include "vec3f.h"
#include "stats.h"
#include "config.h"
#include "status_leds.h"

#define MPU6050_I2C_ADDRESS 0x68
#define MPU6050_SMPLRT_DIV_REGISTER 0x19
#define MPU6050_CONFIG_REGISTER 0x1a
#define MPU6050_GYROSCOPE_CONFIG_REGISTER 0x1b
#define MPU6050_ACCELERATION_CONFIG_REGISTER 0x1c
#define MPU6050_PWR_MGMT_1_REGISTER 0x6b

#define MPU6050_GYROSCOPE_OUT_REGISTER 0x43
#define MPU6050_ACCELERATION_OUT_REGISTER 0x3B

#define CALIB_OFFSET_NB_MES 500
#define TEMP_LSB_2_DEGREE 340.0 // [bit/celsius]
#define TEMP_LSB_OFFSET 12412.0

#define DEFAULT_GYROSCOPE_COEFF 0.98

enum MPU6050GyroscopeConfig
{
  MPU6050_GYROSCOPE_250_DEG = 0x00,
  MPU6050_GYROSCOPE_500_DEG = 0x08,
  MPU6050_GYROSCOPE_1000_DEG = 0x10,
  MPU6050_GYROSCOPE_2000_DEG = 0x18
};

enum MPU6050AccelerationConfig
{
  MPU6050_ACCELERATION_2_G = 0x00,
  MPU6050_ACCELERATION_4_G = 0x08,
  MPU6050_ACCELERATION_8_G = 0x10,
  MPU6050_ACCELERATION_16_G = 0x18
};

class MotionManager
{
public:
  MotionManager();

  bool setup(Config *config, Stats *stats, StatusLeds *status_leds);
  void update();

  Vec3f *get_rotation();
  Vec3f *get_gyroscope();
  Vec3f *get_acceleration();

private:
  bool read();

  bool initialize();
  void update_rotation();

  bool set_gyroscope_config(MPU6050GyroscopeConfig config_num);
  bool set_acceleration_config(MPU6050AccelerationConfig config_num);

  byte write_data(byte reg, byte data);

  byte _address;

  float _temperature;
  float _gyroscope_2_deg;
  float _acceleration_2_g;

  TwoWire *_wire;

  Vec3f _rotation;
  Vec3f _gyroscope;
  Vec3f _acceleration;

  Vec3f _gravity;
  Vec3f _gyroscope_offset;
  Vec3f _acceleration_offset;

  Stats *_stats;
  Config *_config;
  StatusLeds *_status_leds;
};

#endif // _MOTION_MANAGER_H
