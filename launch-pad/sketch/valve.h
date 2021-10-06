#ifndef _VALVE_H
#define _VALVE_H

#include <Arduino.h>

#include "config.h"

class Valve
{
  public:
    Valve();

    bool setup(Config *config);

    bool is();

    void open();
    void close();

    void update();

  private:
  
    bool _flag;
    int16_t _timer;
    Config *_config;
};

#endif // _VALVE_H
