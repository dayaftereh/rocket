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

    /*bool success = this->self_test();
    if (!success)
    {
        Serial.println("fail to execute self test for hmc5883l");
        return false;
    }*/

    /*// Set magnetomer ODR; default is 15 Hz
    bool success = this->write_data(HMC5883L_CONFIGURATION_REGISTER_A, HMC5883L_MEASUREMENT_RATE_15 << 2);
    if (!success)
    {
        Serial.println("fail to set hmc5883l magnetomer ODR");
        return false;
    }

    // set gain (bits[7:5]) to maximum resolution of 0.73 mG/LSB
    success = this->write_data(HMC5883L_CONFIGURATION_REGISTER_B, 0x00);
    if (!success)
    {
        Serial.println("fail to set gain to maximum resolution for hmc5883l");
        return false;
    }

    // enable continuous data mode
    success = this->write_data(HMC5883L_MODE_REGISTER, HMC5883L_MEASUREMENT_CONTINUOUS);
    if (!success)
    {
        Serial.println("fail change mode to continuous for hmc5883l");
        return false;
    }*/

    this->_gain_magnetometer.x = 0.73;
    this->_gain_magnetometer.y = 0.73;
    this->_gain_magnetometer.z = 0.73;

    bool success = this->write_data(HMC5883L_MODE_REGISTER, HMC5883L_MEASUREMENT_CONTINUOUS);
    if (!success)
    {
        Serial.println("fail to start hmc5883l");
        return false;
    }

    success = this->warm_up();
    if (!success)
    {
        Serial.println("fail to exww hmc5883l");
        return false;
    }

    return true;
}

bool HMC5883L::warm_up()
{
    for (size_t i = 0; i < 100; i++)
    {
        // read the self test values
        bool success = this->read();
        if (!success)
        {
            Serial.println("fail to read warm up for hmc5883l");
            return false;
        }

        this->_leds->sleep(2);
    }

    return true;
}

bool HMC5883L::self_test()
{
    Serial.println("starting hmc5883l self test...");

    // set 8-average, 15 Hz default, positive self-test measurement
    bool success = this->write_data(HMC5883L_CONFIGURATION_REGISTER_A, 0x71);
    if (!success)
    {
        Serial.println("fail to set positive self-test measurement for hmc5883l");
        return false;
    }

    // set gain (bits[7:5]) to 5
    success = this->write_data(HMC5883L_CONFIGURATION_REGISTER_B, 0xA0);
    if (!success)
    {
        Serial.println("fail to set gain for hmc5883l");
        return false;
    }

    //  // enable continuous data mode
    success = this->write_data(HMC5883L_MODE_REGISTER, HMC5883L_MEASUREMENT_CONTINUOUS);
    if (!success)
    {
        Serial.println("fail to set to continuous for hmc5883l");
        return false;
    }

    // wait 150 ms
    this->_leds->sleep(150);

    // read the self test values
    success = this->read();
    if (!success)
    {
        Serial.println("fail to read self test values from hmc5883l");
        return false;
    }

    // exit self test
    success = this->write_data(HMC5883L_CONFIGURATION_REGISTER_A, 0x00);
    if (!success)
    {
        Serial.println("fail to sexit self test mode for hmc5883l");
        return false;
    }

    // wait 150 ms
    this->_leds->sleep(150);

    Serial.print("magnetometer selft test [ x: ");
    Serial.print(this->_raw_magnetometer.x, 4);
    Serial.print(", y: ");
    Serial.print(this->_raw_magnetometer.y, 4);
    Serial.print(", z: ");
    Serial.print(this->_raw_magnetometer.z, 4);
    Serial.println(" ]");

    return this->_raw_magnetometer.x < 575 && this->_raw_magnetometer.x > 243 && this->_raw_magnetometer.y < 575 && this->_raw_magnetometer.y > 243 && this->_raw_magnetometer.z < 575 && this->_raw_magnetometer.z > 243;
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

    //this->_gain_magnetometer.x = -2500.0 / (negativeOffset.x - positiveOffset.x);
    //this->_gain_magnetometer.y = -2500.0 / (negativeOffset.y - positiveOffset.y);
    //this->_gain_magnetometer.z = -2500.0 / (negativeOffset.z - positiveOffset.z);

    this->_gain_magnetometer.x = 0.73;
    this->_gain_magnetometer.y = 0.73;
    this->_gain_magnetometer.z = 0.73;

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
    int16_t z = (this->_wire->read() << 8) | this->_wire->read();
    int16_t y = (this->_wire->read() << 8) | this->_wire->read();

    if (x == 0 && y == 0 && z == 0)
    {
        return true;
    }

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

    this->_magnetometer.x = this->_raw_magnetometer.x * this->_gain_magnetometer.x + this->_offset_magnetometer.x;
    this->_magnetometer.y = this->_raw_magnetometer.y * this->_gain_magnetometer.y + this->_offset_magnetometer.y;
    this->_magnetometer.z = this->_raw_magnetometer.z * this->_gain_magnetometer.z + this->_offset_magnetometer.z;
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