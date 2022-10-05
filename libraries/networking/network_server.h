#ifndef _NETWORK_SERVER
#define _NETWORK_SERVER

#include <WiFi.h>
#include <Print.h>
#include <Arduino.h>
#include <AsyncTCP.h>
#include <DNSServer.h>
#include <ESPAsyncWebServer.h>

#include "networking_server_config.h"
#include "captive_request_handler.h"

class NetworkServer
{
public:
    NetworkServer();

    bool setup(NetworkingServerConfig *config, Print *print);
    void update();

private:
    bool setup_captive_portal();

    DNSServer _dns_server;
    AsyncWebServer _server;

    Print *_print;
    NetworkingServerConfig *_config;
}

#endif // _NETWORK_SERVER