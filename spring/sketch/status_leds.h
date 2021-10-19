#ifndef _STATUS_LEDS_H
#define _STATUS_LEDS_H

#include <Arduino.h>

#include "config.h"

class StatusLeds
{
  public:
    StatusLeds();

    void ready();

    void setup();

    void progress();

    void flash(int count, int timeout);      

  private:

    void on();
    void off();  
    void toggle();  

    bool _led1;
    bool _ready;   
    unsigned long _timer;
};

#endif // _STATUS_LEDS_H
