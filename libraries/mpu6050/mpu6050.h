#ifndef _MPU_6050_H
#define _MPU_6050_H

#include <Wire.h>
#include <Print.h>
#include <Arduino.h>
#include <constants.h>

#include "leds.h"
#include "vec3f.h"
#include "gyroscope.h"
#include "acceleration.h"

#define MPU6050_I2C_ADDRESS 0x68
#define MPU6050_SMPLRT_DIV_REGISTER 0x19
#define MPU6050_CONFIG_REGISTER 0x1a
#define MPU6050_GYROSCOPE_CONFIG_REGISTER 0x1b
#define MPU6050_ACCELERATION_CONFIG_REGISTER 0x1c
#define MPU6050_SINGLE_PATH_RESET_REGISTER 0x68
#define MPU6050_PWR_MGMT_1_REGISTER 0x6b
#define MPU6050_WHO_AM_I_REGISTER 0x75

#define MPU6050_ACCELERATION_OUT_REGISTER 0x3B

#define MPU6050_TEMP_LSB_2_DEGREE 340.0 // [bit/celsius]
#define MPU6050_TEMP_LSB_OFFSET 12412.0

#define MPU6050_CALIBRATION_READS 50

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

class MPU6050: public Gyroscope, public Acceleration
{
public:
    MPU6050();

    bool setup(TwoWire *wire, Print *print, Leds *leds);

    bool update();

    void set_acceleration_offset(Vec3f &offset);

    Vec3f *get_gyroscope();
    Vec3f *get_acceleration();

    Vec3f *get_raw_gyroscope();
    Vec3f *get_raw_acceleration();

private:

    uint8_t get_device_id();

    bool test_connection();

    bool reset();

    bool read();
    bool calibrate();

    bool write_data(byte reg, byte data);

    bool set_gyroscope_config(MPU6050GyroscopeConfig config_num);
    bool set_acceleration_config(MPU6050AccelerationConfig config_num);

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

    Leds *_leds;
    Print *_print;
    TwoWire *_wire;
};

#endif // _MPU_6050_H
