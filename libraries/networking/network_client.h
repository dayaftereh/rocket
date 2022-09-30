#ifndef _NETWORK_CLIENT
#define _NETWORK_CLIENT

#include <WiFi.h>
#include <Print.h>
#include <Arduino.h>

#include "leds.h"
#include "networking_config.h"

#define WIFI_CONNECT_TIMEOUT (1000 * 30)

class NetworkClient
{
public:
    NetworkClient();

    bool setup(NetworkConfig *config, Leds *leds, Print *print);
    void update();

private:
    bool wait_for_wifi_connected();

    Leds *_leds;
    Print *_print;
    NetworkConfig *_config;
}

#endif // _NETWORK_CLIENT