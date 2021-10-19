#ifndef _STATS_H
#define _STATS_H

#include <Arduino.h>

#include "config.h"

class Stats
{
  public:
    Stats();

    bool setup();
    float update();
    float get_delta();

  private:

    float _delta;
    unsigned long _last;

};

#endif // _STATS_H
