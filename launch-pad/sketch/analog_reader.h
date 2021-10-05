#ifndef _ANALOG_READER_H
#define _ANALOG_READER_H

#include <Arduino.h>
#include <ADS1X15.h>

#include "config.h"

class AnalogReader
{
  public:
    AnalogReader();
    bool setup(Config *config);

    void update();

    float get_voltage();
    float get_pressure();    

  private:
  
    float _voltage;
    float _pressure;

    ADS1015 * _ads;
    Config *_config;
};


#endif // _ANALOG_READER_H
