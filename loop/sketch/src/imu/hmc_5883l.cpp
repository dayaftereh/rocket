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

    this->_scale = 1.0;

    this->_offset_magnetometer.x = 0.0;
    this->_offset_magnetometer.y = 0.0;
    this->_offset_magnetometer.z = 0.0;

    bool success = this->read_identification();
    if (!success)
    {
        Serial.println("fail to read identification for hmc5883l");
        return false;
    }

    success = this->set_average_samples(HMC5883L_AVERAGE_SAMPLE_FOUR);
    if (!success)
    {
        Serial.println("fail to set average samples for hmc5883l");
        return false;
    }

    success = this->set_scale(HMC5883L_SCALE_130_GAUSS);
    if (!success)
    {
        Serial.println("fail to set scale for hmc5883l");
        return false;
    }

    success = this->write_data(HMC5883L_MODE_REGISTER, HMC5883L_MEASUREMENT_CONTINUOUS);
    if (!success)
    {
        Serial.println("fail to start continuous mode for hmc5883l");
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

bool HMC5883L::read_identification()
{
    this->_wire->beginTransmission(this->_address);
    this->_wire->write(10); //select Identification register A
    this->_wire->endTransmission();

    // require 3
    uint8_t length = 3;
    // request the magnetometer values from hmc5883l
    int received = this->_wire->requestFrom(this->_address, length);
    if (received != length)
    {
        return false;
    }

    // read the register content
    char a = this->_wire->read();
    char b = this->_wire->read();
    char c = this->_wire->read();

    Serial.print("hmc5883l identification [ a:");
    Serial.print(a);
    Serial.print(", b:");
    Serial.print(b);
    Serial.print(", c:");
    Serial.print(c);
    Serial.println(" ]");

    return a == 'H' && b == '4' && c == '3';
}

bool HMC5883L::set_scale(HMC5883L_MEASUREMENT_SCALE scale)
{
    switch (scale)
    {
    case HMC5883L_SCALE_088_GAUSS:
        this->_scale = 0.73;
        break;
    case HMC5883L_SCALE_130_GAUSS:
        this->_scale = 0.92;
        break;
    case HMC5883L_SCALE_190_GAUSS:
        this->_scale = 1.22;
        break;
    case HMC5883L_SCALE_250_GAUSS:
        this->_scale = 1.52;
        break;
    case HMC5883L_SCALE_400_GAUSS:
        this->_scale = 2.27;
        break;
    case HMC5883L_SCALE_470_GAUSS:
        this->_scale = 2.56;
        break;
    case HMC5883L_SCALE_560_GAUSS:
        this->_scale = 3.03;
        break;
    case HMC5883L_SCALE_810_GAUSS:
        this->_scale = 4.35;
        break;
    }
    // Setting is in the top 3 bits of the register.
    uint8_t flag = scale << 5;
    bool success = this->write_data(HMC5883L_CONFIGURATION_REGISTER_B, flag);
    if (!success)
    {
        return false;
    }

    return true;
}
bool HMC5883L::set_average_samples(HMC5883L_AVERAGE_SAMPLE sampling)
{
    bool success = this->write_data(HMC5883L_CONFIGURATION_REGISTER_A, sampling);
    if (!success)
    {
        return false;
    }

    return true;
}

bool HMC5883L::calibrate()
{
    Serial.println("calibrating hmc5883l...");
    Serial.println("please rotate the compass");

    Vec3f tmp = this->_offset_magnetometer.clone();

    this->_offset_magnetometer.x = 0.0;
    this->_offset_magnetometer.y = 0.0;
    this->_offset_magnetometer.z = 0.0;

    Vec3f min_value = Vec3f(1e10, 1e10, 1e10);
    Vec3f max_value = Vec3f(-1e10, -1e10, -1e10);

    uint64_t elapsed = 0.0;
    uint64_t timer = millis();

    while (elapsed < 10000)
    {
        // update the timer
        uint64_t delta = millis() - timer;
        if (delta > 1000)
        {
            timer = millis();
            elapsed += delta;
            Serial.print(".");
        }

        // update the sensor
        this->update();
        Vec3f v = this->_magnetometer.clone();

        /*Serial.print("v: [ x:");
        Serial.print(v.x);
        Serial.print(", y:");
        Serial.print(v.y);
        Serial.print(", z:");
        Serial.print(v.z);
        Serial.println(" ]");*/

        if ((fabs(v.x) > 600.0) || (fabs(v.y) > 600.0) || (fabs(v.z) > 600.0))
        {
            continue;
        }

        min_value.x = min(min_value.x, v.x);
        min_value.y = min(min_value.y, v.y);
        min_value.z = min(min_value.z, v.z);

        max_value.x = max(max_value.x, v.x);
        max_value.y = max(max_value.y, v.y);
        max_value.z = max(max_value.z, v.z);

        this->_leds->sleep(33);
    }

    Vec3f new_offset;
    new_offset.x = (max_value.x + min_value.x) / 2.0;
    new_offset.y = (max_value.y + min_value.y) / 2.0;
    new_offset.z = (max_value.z + min_value.z) / 2.0;

    Serial.println("");

    Serial.print("magnetometer offset [ x:");
    Serial.print(new_offset.x);
    Serial.print(", y:");
    Serial.print(new_offset.y);
    Serial.print(", z:");
    Serial.print(new_offset.z);
    Serial.println(" ]");

    this->_offset_magnetometer = tmp;

    return true;
}

bool HMC5883L::read()
{
    this->_wire->beginTransmission(this->_address);
    this->_wire->write(HMC5883L_DATA_REGISTER);
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

    this->_magnetometer.x = this->_raw_magnetometer.x * this->_scale + this->_offset_magnetometer.x;
    this->_magnetometer.y = this->_raw_magnetometer.y * this->_scale + this->_offset_magnetometer.y;
    this->_magnetometer.z = this->_raw_magnetometer.z * this->_scale + this->_offset_magnetometer.z;
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