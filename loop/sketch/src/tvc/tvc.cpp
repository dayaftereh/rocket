#include "tvc.h"

TVC::TVC()
{
}

bool TVC::setup(Config *config, LEDs *leds, IMU *imu)
{
    this->_imu = imu;
    this->_leds = leds;
    this->_config = config;

    int status = this->_x.attach(TVC_X_PIN, 500, 2400);
    if (status == 0)
    {
        Serial.println("fail to attach servo tvc x");
        return false;
    }

    status = this->_y.attach(TVC_Y_PIN, 500, 2400);
    if (status == 0)
    {
        Serial.println("fail to attach servo tvc y");
        return false;
    }

    this->_leds->sleep(100);

    this->_x.write(5);
    this->_y.write(5);

    this->_leds->sleep(100);

    this->_x.write(-5);
    this->_y.write(-5);

    this->_leds->sleep(100);

    this->_x.write(0);
    this->_y.write(0);

    return true;
}

void TVC::disable()
{
    this->_enabled = false;
}

void TVC::enable()
{
    this->_enabled = true;
}

void TVC::update()
{
    if (!this->_enabled)
    {
        return;
    }
}