#ifndef _NETWORK_SERVER
#define _NETWORK_SERVER

#include <WiFi.h>
#include <Print.h>
#include <Arduino.h>

#include "networking_config.h"

class NetworkServer
{
public:
    NetworkServer();

    bool setup(NetworkConfig *config, Print *print);
    void update();

private:
    Print *_print;
    NetworkConfig *_config;
}

#endif // _NETWORK_SERVER