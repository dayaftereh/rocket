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

    void finalize();

    void flash(int count, int timeout);      

    void on();
    void off();
    
  private:
    
    void toggle();  

    bool _led1;
    bool _ready;  
    bool _finalized;
    unsigned long _timer;
};

#endif // _STATUS_LEDS_H
