#ifndef _MPU_6050_H
#define _MPU_6050_H

#include <Arduino.h>
#include <Wire.h>

#include "config.h"
#include "status_leds.h"

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

class MPU6050
{
public:
    MPU6050();

    bool setup(Config *config, TwoWire *wire, StatusLeds *status_leds);

    void update();

    Vec3f *get_gyroscope();
    Vec3f *get_acceleration();

private:
    bool read();
    bool calibrate();

    bool set_gyroscope_config(MPU6050GyroscopeConfig config_num);
    bool set_acceleration_config(MPU6050AccelerationConfig config_num);

    bool write_data(byte reg, byte data);

    byte _address;

    float _raw_temperature;

    float _gyroscope_2_deg;
    float _acceleration_2_g;

    Vec3f _gyroscope;
    Vec3f _acceleration;

    Vec3f _gyroscope_offset;
    Vec3f _acceleration_offset;

    Vec3f _raw_gyroscope;
    Vec3f _raw_acceleration;

    TwoWire *_wire;
    Config *_config;
    StatusLeds *_status_leds;
};

#endif // _MPU_6050_H
