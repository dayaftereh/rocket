#ifndef _QMC5883L_H
#define _QMC5883L_H

#include <Arduino.h>
#include <Wire.h>

#include "vec3f.h"
#include "config.h"
#include "status_leds.h"

#define QMC5883L_I2C_ADDRESS 0x0D

enum QMC5883LMode
{
    QMC5883L_MODE_STANDBY = 0b00000000,
    QMC5883L_MODE_CONTINUOUS = 0b00000001,
};

// Output Data Rate
enum QMC5883LORD
{
    QMC5883L_ODR_10HZ = 0b00000000,
    QMC5883L_ODR_50HZ = 0b00000100,
    QMC5883L_ODR_100HZ = 0b00001000,
    QMC5883L_ODR_200HZ = 0b00001100,

};

// Full Scale
enum QMC5883LRNG
{
    QMC5883L_RNG_2G = 0b00000000,
    QMC5883L_RNG_8G = 0b00010000,

};

// Over Sample Ratio
enum QMC5883LOSR
{
    QMC5883L_OSR_512 = 0b00000000,
    QMC5883L_OSR_256 = 0b01000000,
    QMC5883L_OSR_128 = 0b10000000,
    QMC5883L_OSR_64 = 0b11000000,

};
class QMC5883L
{
public:
    QMC5883L();

    bool setup(Config *config, TwoWire *wire, StatusLeds *status_leds);

    void update();

    Vec3f *get_magnetometer();

private:
    bool read();

    bool configure(QMC5883LMode mode, QMC5883LORD ord, QMC5883LRNG rnd, QMC5883LOSR osr);

    bool calibrate();

    bool write_data(byte reg, byte data);

    byte _address;

    float _magnetometer_2_gauss;

    Vec3f _magnetometer;
    Vec3f _raw_magnetometer;
    Vec3f _magnetometer_offset;

    TwoWire *_wire;
    Config *_config;
    StatusLeds *_status_leds;
};

#endif // _QMC5883L_H
