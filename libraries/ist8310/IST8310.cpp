#include "IST8310.h"

IST8310::IST8310()
{
}

bool IST8310::setup(TwoWire *wire)
{
    this->_wire = wire;
    this->_i2c_address = IST8310_I2C_ADDRESS;

    this->_values.x = 0.0;
    this->_values.y = 0.0;
    this->_values.z = 0.0;

    bool success = this->soft_reset();
    if (!success)
    {
        return false;
    }

    return true;
}

bool IST8310::read_device_id()
{
    bool success = this->read_register(IST8310_REGISTER_WHO_AM_I, &this->_device_id);
    if (!success)
    {
        return false;
    }

    if (this->_device_id != IST8310_DEVICE_ID)
    {
        return false;
    }

    return true;
}

bool IST8310::soft_reset()
{
    uint8_t reset_bit = 0x1;
    bool success = this->write_register(IST8310_REGISTER_CNTL2, reset_bit);
    if (!success)
    {
        return false;
    }

    for (size_t i = 0; i < IST8310_RESET_RETRIES; i++)
    {
        success = this->read_device_id();
        if (!success)
        {
            continue;
        }

        uint8_t value;
        success = this->read_register(IST8310_REGISTER_CNTL2, &value);
        if (!success)
        {
            continue;
        }

        if ((value & reset_bit) == 0)
        {
            return true;
        }
    }

    return false;
}

bool IST8310::read_register(uint8_t reg, uint8_t *value)
{
    this->_wire->beginTransmission(this->_i2c_address);
    this->_wire->write(reg);
    uint8_t status = _wire->endTransmission();

    if (status != 0)
    {
        return false;
    }

    uint8_t length = 1;
    uint8_t n = _wire->requestFrom(this->_i2c_address, length);
    if (n != length)
    {
        return false;
    }

    *value = this->_wire->read();

    return true;
}

bool IST8310::write_register(uint8_t reg, uint8_t value)
{
    this->_wire->beginTransmission(this->_i2c_address);
    this->_wire->write(reg);
    this->_wire->write(value);
    uint8_t status = _wire->endTransmission();
    return status == 0;
}

bool IST8310::read()
{
    bool success = this->write_register(IST8310_REGISTER_CNTL1, 0x1);
    if (!success)
    {
        return false;
    }

    this->_wire->beginTransmission(this->_i2c_address);
    this->_wire->write(0x02);
    uint8_t status = _wire->endTransmission();
    if (status != 0)
    {
        return false;
    }

    uint8_t length = 7;
    uint8_t n = this->_wire->requestFrom(this->_i2c_address, length);
    if (n != length)
    {
        return false;
    }

    status = this->_wire->read();

    // read low / high x
    uint8_t x_low = this->_wire->read();
    int x = word(this->_wire->read(), x_low);

    // read low / high y
    uint8_t y_low = this->_wire->read();
    int y = word(this->_wire->read(), y_low);

    // read low / high z
    uint8_t z_low = this->_wire->read();
    int z = word(this->_wire->read(), z_low);

    this->_values.x = float(x);
    this->_values.y = float(y);
    this->_values.z = float(z);

    return true;
}

bool IST8310::update()
{
    bool success = this->read();
    return success;
}

bool IST8310::set_average(IST8310AverageY y, IST8310AverageXZ xz)
{
    uint8_t value = (uint8_t(y) << 2) & uint8_t(xz);
    bool success = this->write_register(IST8310_REGISTER_AVGCNTL, value);
    if (!success)
    {
        return false;
    }
    return true;
}

Vec3f *IST8310::get_magnetometer()
{
    return &this->_values;
}

bool IST8310::set_selftest(bool enabled)
{
    uint8_t value = 0x0;
    if (enabled)
    {
        value = B100000;
    }
    bool success = this->write_register(IST8310_REGISTER_STR, value);
    if (!success)
    {
        return false;
    }
    return true;
}

bool IST8310::calibration()
{
    
    return true;
}