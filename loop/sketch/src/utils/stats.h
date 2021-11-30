#ifndef _STATS_H
#define _STATS_H

#include <Arduino.h>

#include "../config/config.h"

class Stats
{
  public:
    Stats();

    bool setup();
    float update();
    float get_fps();
    float get_delta();

  private:

    bool _first;

    float _fps;

    int _counter;
    float _sum_delta;

    float _delta;
    unsigned long _last;
};

#endif // _STATS_H
