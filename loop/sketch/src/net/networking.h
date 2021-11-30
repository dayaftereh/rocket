#ifndef _NETWORKING_H
#define _NETWORKING_H

#include <WiFi.h>
#include <ESPmDNS.h>

#include "../utils/leds.h"
#include "../config/config.h"

class Networking
{
public:
    Networking();

    bool setup(LEDs *leds);

private:
    LEDs *_leds;
};

#endif // _NETWORKING_H
