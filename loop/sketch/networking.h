#ifndef _NETWORKING_H
#define _NETWORKING_H

#include <WiFi.h>
#include <ESPmDNS.h>

#include "config.h"

class Networking
{
public:
    Networking();

    bool setup();

private:
};

#endif // _NETWORKING_H
