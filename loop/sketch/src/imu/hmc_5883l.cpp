#include "hmc_5883l.h"

HMC5883L::HMC5883L()
{
}

bool HMC5883L::setup(Config *config, TwoWire *wire, LEDs *leds)
{
    this->_wire = wire;
    this->_leds = leds;
    this->_config = config;
    this->_address = HMC5883L_I2C_ADDRESS;

    // start communicate
    bool success = this->write_data(HMC5883L_MODE_REGISTER, HMC5883L_MEASUREMENT_CONTINUOUS);
    if (!success)
    {
        Serial.println("fail to communicate and setup hmc5883l");
        return false;
    }

    success = this->calibrate();
    if (!success)
    {
        Serial.println("fail to calibrate hmc5883l");
        return false;
    }

    return true;
}

bool HMC5883L::calibrate()
{
    Serial.println("calibrating hmc5883l...");

    // Setup positive bias values
    bool success = this->write_data(HMC5883L_CONFIGURATION_REGISTER_A, 0x11);
    if (!success)
    {
        Serial.println("fail to change mode of hmc5883l to positive bias");
        return false;
    }

    // Wait for sensor to get ready
    this->_leds->sleep(100);

    // Read positive bias values
    success = this->read();
    if (!success)
    {
        Serial.println("fail to read from hmc5883l");
        return false;
    }

    Vec3f positiveOffset = this->_raw_magnetometer.clone();

    // Setup negative bias values
    success = this->write_data(HMC5883L_CONFIGURATION_REGISTER_A, 0x12);
    if (!success)
    {
        Serial.println("fail to change mode of hmc5883l to negative bias");
        return false;
    }

    // Wait for sensor to get ready
    this->_leds->sleep(100);

    // Read negative bias values
    success = this->read();
    if (!success)
    {
        Serial.println("fail to read from hmc5883l");
        return false;
    }

    Vec3f negativeOffset = this->_raw_magnetometer.clone();

    // Back to normal
    success = this->write_data(HMC5883L_CONFIGURATION_REGISTER_A, 0x10);
    if (!success)
    {
        Serial.println("fail to change mode of hmc5883l back to normal");
        return false;
    }

    this->_gain_magnetometer.x = -2500.0 / (negativeOffset.x - positiveOffset.x);
    this->_gain_magnetometer.y = -2500.0 / (negativeOffset.y - positiveOffset.y);
    this->_gain_magnetometer.z = -2500.0 / (negativeOffset.z - positiveOffset.z);

    Serial.print("magnetometer gain [ x: ");
    Serial.print(this->_gain_magnetometer.x, 4);
    Serial.print(", y: ");
    Serial.print(this->_gain_magnetometer.y, 4);
    Serial.print(", z: ");
    Serial.print(this->_gain_magnetometer.z, 4);
    Serial.println(" ]");

    return true;
}

bool HMC5883L::read()
{
    this->_wire->beginTransmission(this->_address);
    this->_wire->write(0x03);
    this->_wire->endTransmission(false);

    // require 6
    uint8_t length = 6;
    // request the magnetometer values from hmc5883l
    int received = this->_wire->requestFrom(this->_address, length);
    if (received != length)
    {
        return false;
    }

    int16_t x = (this->_wire->read() << 8) | this->_wire->read();
    int16_t y = (this->_wire->read() << 8) | this->_wire->read();
    int16_t z = (this->_wire->read() << 8) | this->_wire->read();

    this->_raw_magnetometer.x = (float)x;
    this->_raw_magnetometer.y = (float)y;
    this->_raw_magnetometer.z = (float)z;

    return true;
}

void HMC5883L::update()
{
    bool success = this->read();
    if (!success)
    {
        return;
    }

    this->_magnetometer.x = (this->_raw_magnetometer.x + this->_offset_magnetometer.x) * this->_gain_magnetometer.x;
    this->_magnetometer.y = (this->_raw_magnetometer.y + this->_offset_magnetometer.y) / this->_gain_magnetometer.y;
    this->_magnetometer.z = (this->_raw_magnetometer.z + this->_offset_magnetometer.z) / this->_gain_magnetometer.z;
}

bool HMC5883L::write_data(byte reg, byte data)
{
    this->_wire->beginTransmission(this->_address);

    this->_wire->write(reg);
    this->_wire->write(data);

    byte status = this->_wire->endTransmission();
    /*
    0:success
    1:data too long to fit in transmit buffer
    2:received NACK on transmit of address
    3:received NACK on transmit of data
    4:other error
  */
    return status == 0;
}

Vec3f *HMC5883L::get_magnetometer()
{
    return &this->_magnetometer;
}