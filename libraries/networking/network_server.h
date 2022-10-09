#ifndef _NETWORK_SERVER
#define _NETWORK_SERVER

#include <WiFi.h>
#include <Print.h>
#include <SPIFFS.h>
#include <Arduino.h>
#include <AsyncTCP.h>
#include <DNSServer.h>
#include <ESPAsyncWebServer.h>

#include "web_message.h"
#include "networking_server_config.h"
#include "captive_request_handler.h"

typedef std::function<void(AsyncWebSocketClient *client, uint8_t message_type, uint8_t *data, size_t len)> NetworkWebsocketHandler;

class NetworkServer
{
public:
    NetworkServer();

    bool setup(NetworkingServerConfig *config, Print *print);
    void update();

    void set_websocket_handler(NetworkWebsocketHandler handler);

private:
    bool setup_captive_portal();

    int message_type(uint8_t *data, size_t len);

    void on_websocket_message(AsyncWebSocketClient *client, uint8_t *data, size_t len);
    void on_websocket_event(AsyncWebSocketClient *client, AwsEventType type, void *arg uint8_t *data, size_t len);

    AsyncWebSocket _ws;
    DNSServer _dns_server;
    AsyncWebServer _server;

    NetworkWebsocketHandler _websocket_handler;

    Print *_print;
    NetworkingServerConfig *_config;
}

#endif // _NETWORK_SERVER