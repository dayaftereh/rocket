#ifndef _STATUS_LEDS_H
#define _STATUS_LEDS_H

#include <Print.h>
#include <Arduino.h>

#include "leds.h"

class StatusLeds : public Leds
{
public:
    StatusLeds();

    void setup(int error_pin, int status_pin, Print *print);

    void error(int error);

    void sleep(int timeout);

    void update();

private:
    int _error_pin;
    int _status_pin;

    Print *_print;
};

#endif // _STATUS_LEDS_H