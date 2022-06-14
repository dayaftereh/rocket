#ifndef _IST_8310_H
#define _IST_8310_H

#include <Wire.h>
#include <Arduino.h>

#include <vec3f.h>

#define IST8310_DEVICE_ID 0x10
#define IST8310_I2C_ADDRESS 0x0E

#define IST8310_RESET_RETRIES 10
#define IST8310_CALIBRATION_READINGS 10

#define IST8310_REGISTER_WHO_AM_I 0x00
#define IST8310_REGISTER_CNTL1 0x0A
#define IST8310_REGISTER_CNTL2 0x0B
#define IST8310_REGISTER_STR 0x0C
#define IST8310_REGISTER_AVGCNTL 0x41

enum IST8310AverageY
{
    IST8310_NO_AVERAGE_Y = 0x000,
    IST8310_2_AVERAGE_Y = 0x001,
    IST8310_4_AVERAGE_Y = 0x010,
    IST8310_8_AVERAGE_Y = 0x011,
    IST8310_16_AVERAGE_Y = 0x100
};

enum IST8310AverageXZ
{
    IST8310_NO_AVERAGE_X_Z = 0x000,
    IST8310_2_AVERAGE_X_Z = 0x001,
    IST8310_4_AVERAGE_X_Z = 0x010,
    IST8310_8_AVERAGE_X_Z = 0x011,
    IST8310_16_AVERAGE_X_Z = 0x100
};

class IST8310
{
public:
    IST8310();

    bool setup(TwoWire *wire);

    bool soft_reset();

    bool update();

    bool calibration();

    bool set_average(IST8310AverageY y, IST8310AverageXZ xz);

    Vec3f *get_raw();

private:
    bool read();
    bool loop_read(Vec3f &sum, size_t loops, int timeout);

    bool read_device_id();
    bool set_selftest(bool enabled);

    bool read_register(uint8_t reg, uint8_t *value);
    bool write_register(uint8_t reg, uint8_t value);

    Vec3f _raw;

    uint8_t _device_id;
    uint8_t _i2c_address;

    TwoWire *_wire;
};

#endif // _IST_8310_H