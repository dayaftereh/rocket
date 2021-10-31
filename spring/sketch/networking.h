#ifndef _NETWORKING_H
#define _NETWORKING_H

#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>

#include "config.h"

class Networking
{
public:
    Networking();

    bool setup();

private:
};

#endif // _NETWORKING_H
