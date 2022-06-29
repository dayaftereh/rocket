#include "status_leds.h"

StatusLeds::StatusLeds()
{
}

void StatusLeds::setup(int error_pin, int status_pin, Print *print)
{
    this->_error_pin = error_pin;
    this->_status_pin = status_pin;

    pinMode(this->_error_pin, OUTPUT);
    pinMode(this->_status_pin, OUTPUT);
}

void StatusLeds::error(int error)
{
    while (true)
    {
        this->sleep(10);
    }
}

void StatusLeds::sleep(int timeout)
{
    unsigned long start = millis();
    unsigned long _timeout = (unsigned long)timeout;

    while (_timeout > (millis() - start))
    {
        this->update();
        unsigned long elapsed = max(_timeout - (millis() - start), (unsigned long)1);
        int t = min((unsigned long)10, elapsed);
        delay(t);
    }
}

void StatusLeds::update()
{
}