#ifndef _PARACHUTE_MANAGER_H
#define _PARACHUTE_MANAGER_H

#include <Arduino.h>

#include "config.h"

class ParachuteManager
{
  public:
    ParachuteManager();

    bool setup(Config *config);
    void update();

    void trigger();
    void altitude_trigger();
    void orientation_trigger();

    bool is_altitude_triggered();
    bool is_orientation_triggered();

  private:

    void reset();

    bool _trigger;
    bool _altitude;
    bool _orientation;

    unsigned long _timer;

    Config *_config;
};

#endif // _PARACHUTE_MANAGER_H
