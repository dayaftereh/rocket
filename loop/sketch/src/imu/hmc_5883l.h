#ifndef _HMC5883L_H
#define _HMC5883L_H

#include <Arduino.h>
#include <Wire.h>

#include "../math/vec3f.h"
#include "../utils/leds.h"
#include "../config/config.h"

#define HMC5883L_I2C_ADDRESS 0x1E

#define HMC5883L_MODE_REGISTER 0x02
#define HMC5883L_CONFIGURATION_REGISTER_A 0x00
#define HMC5883L_CONFIGURATION_REGISTER_B 0x01

#define HMC5883L_MEASUREMENT_CONTINUOUS 0x00 

class HMC5883L
{
public:
    HMC5883L();

    bool setup(Config *config, TwoWire *wire, LEDs *leds);

    void update();

    Vec3f *get_magnetometer();

private:
    bool read();
    bool calibrate();
    bool write_data(byte reg, byte data);

    byte _address;

    Vec3f _magnetometer;
    Vec3f _raw_magnetometer;
    Vec3f _gain_magnetometer;
    Vec3f _offset_magnetometer;

    LEDs *_leds;
    TwoWire *_wire;
    Config *_config;
};

#endif // _HMC5883L_H