#ifndef _MOTION_MANAGER_H
#define _MOTION_MANAGER_H

#include <Arduino.h>
#include <Wire.h>
#include <Kalman.h>

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

#define MPU6050_ACCELERATION_OUT_REGISTER 0x3B

#define MPU6050_TEMP_LSB_2_DEGREE 340.0 // [bit/celsius]
#define MPU6050_TEMP_LSB_OFFSET 12412.0

#define HMC5883L_I2C_ADDRESS 0x0D

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
    bool initialize();
    void update_yaw();
    void update_pitch_roll();
    void update_acceleration_gyroscope();

    bool init_mpu6050();
    bool update_mpu6050();
    bool write_mpu6050_data(byte reg, byte data);
    bool set_gyroscope_config(MPU6050GyroscopeConfig config_num);
    bool set_acceleration_config(MPU6050AccelerationConfig config_num);

    bool init_hmc5883l();
    bool update_hmc5883l();
    bool calibrate_magnetometer();
    bool write_hmc5883l_data(byte reg, byte data);

    bool write_data(byte addr, byte reg, byte data);

    byte _mpu6050_address;
    byte _hmc5883l_address;

    float _raw_temperature;
    float _gyroscope_2_deg;
    float _acceleration_2_g;

    Vec3f _raw_magnetometer;
    Vec3f _gain_magnetometer;

    Vec3f _gyroscope;
    Vec3f _acceleration;

    Vec3f _raw_gyroscope;
    Vec3f _raw_acceleration;

    Vec3f _rotation;
    Vec3f _kalman_angle;

    Vec3f _comp_angle;
    Vec3f _gyroscope_angle;

    Kalman _kalman_x;
    Kalman _kalman_y;
    Kalman _kalman_z;

    TwoWire *_wire;

    Stats *_stats;
    Config *_config;
    StatusLeds *_status_leds;
};

#endif // _MOTION_MANAGER_H
