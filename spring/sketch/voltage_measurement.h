#ifndef _VOLTAGE_MEASUREMENT_H
#define _VOLTAGE_MEASUREMENT_H

#include <Arduino.h>

#include "config.h"

class VoltageMeasurement
{
  public:
    VoltageMeasurement();

    bool setup(Config *config);

    void update();

    float get_voltage();

  private:

    float _voltage;
    Config *_config;
};

#endif // _VOLTAGE_MEASUREMENT_H
