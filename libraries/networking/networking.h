#ifndef _NETWORKING_H
#define _NETWORKING_H

#include <WiFi.h>
#include <Print.h>
#include <Arduino.h>

#include "networking_config.h"

class Networking
{
public:
    Networking();

    bool setup(NetworkConfig *config, Print *print);
    void update();

private:
    bool setup_access_point();

    Print *_print;
    NetworkConfig *_config;
}

#endif // _NETWORKING_H