#ifndef _HMC5883L_H
#define _HMC5883L_H

#include <Arduino.h>
#include <Wire.h>

#include "../math/vec3f.h"
#include "../utils/leds.h"
#include "../config/config.h"

#define HMC5883L_I2C_ADDRESS 0x1E

#define HMC5883L_DATA_REGISTER 0x03
#define HMC5883L_MODE_REGISTER 0x02
#define HMC5883L_CONFIGURATION_REGISTER_A 0x00
#define HMC5883L_CONFIGURATION_REGISTER_B 0x01

#define HMC5883L_MEASUREMENT_CONTINUOUS 0x00

enum HMC5883L_AVERAGE_SAMPLE
{
  HMC5883L_AVERAGE_SAMPLE_ONE = 0x10,
  HMC5883L_AVERAGE_SAMPLE_TWO = 0x30,
  HMC5883L_AVERAGE_SAMPLE_FOUR = 0x50,
  HMC5883L_AVERAGE_SAMPLE_EIGHT = 0x80
};

enum HMC5883L_MEASUREMENT_SCALE
{
  HMC5883L_SCALE_088_GAUSS = 0x00,
  HMC5883L_SCALE_130_GAUSS = 0x01,
  HMC5883L_SCALE_190_GAUSS = 0x02,
  HMC5883L_SCALE_250_GAUSS = 0x03,
  HMC5883L_SCALE_400_GAUSS = 0x04,
  HMC5883L_SCALE_470_GAUSS = 0x05,
  HMC5883L_SCALE_560_GAUSS = 0x06,
  HMC5883L_SCALE_810_GAUSS = 0x07
};

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
  bool read_identification();
  bool set_scale(HMC5883L_MEASUREMENT_SCALE scale);
  bool set_average_samples(HMC5883L_AVERAGE_SAMPLE sampling);

  bool write_data(byte reg, byte data);

  byte _address;
  float _scale;

  Vec3f _magnetometer;
  Vec3f _raw_magnetometer;
  Vec3f _offset_magnetometer;

  LEDs *_leds;
  TwoWire *_wire;
  Config *_config;
};

#endif // _HMC5883L_H