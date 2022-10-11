#ifndef _LAUNCH_COMPUTER_H
#define _LAUNCH_COMPUTER_H

#include <leds.h>

#include "config.h"

class LaunchComputer
{
public:
    LaunchComputer();

    bool setup(Config *config, Leds *leds);
    void update();

private:

    Leds *_leds;
    Config *_config;
};

#endif // _LAUNCH_COMPUTER_H