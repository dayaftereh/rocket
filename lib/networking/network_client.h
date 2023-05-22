#ifndef _NETWORK_CLIENT_H
#define _NETWORK_CLIENT_H

#include <WiFi.h>
#include <Print.h>
#include <Arduino.h>

#include "leds.h"
#include "network_client_config.h"

#define WIFI_CONNECT_TIMEOUT (1000 * 30)

class NetworkClient
{
public:
    NetworkClient();

    bool setup(NetworkingClientConfig *config, Leds *leds, Print *print);
    void update();

private:
    bool wait_for_wifi_connected();

    Leds *_leds;
    Print *_print;
    NetworkingClientConfig *_config;
};

#endif // _NETWORK_CLIENT_H