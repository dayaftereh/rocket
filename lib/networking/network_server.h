#ifndef _NETWORK_SERVER_H
#define _NETWORK_SERVER_H

#include <stdarg.h>

#include <WiFi.h>
#include <Print.h>
#include <SPIFFS.h>
#include <Arduino.h>
#include <AsyncTCP.h>
#include <DNSServer.h>
#include <ESPAsyncWebServer.h>

#include "networking_server_config.h"
#include "captive_request_handler.h"

#include "../web-message/web_message.h"

typedef std::function<void(AsyncWebSocketClient *client)> NetworkWebsocketClientHandler;
typedef std::function<void(AsyncWebSocketClient *client, WebMessageType message_type, uint8_t *data, size_t len)> NetworkWebsocketHandler;

class NetworkServer
{
public:
    NetworkServer();

    bool setup(NetworkingServerConfig *config, Print *print);
    void update();

    void broadcast(uint8_t *data, size_t size);
    void send(uint8_t *data, size_t size, int num, ...);

    void set_websocket_handler(NetworkWebsocketHandler handler);
    void set_websocket_connected_handler(NetworkWebsocketClientHandler handler);
    void set_websocket_disconnected_handler(NetworkWebsocketClientHandler handler);

private:
    bool setup_captive_portal();

    WebMessageType message_type(uint8_t *data, size_t len);

    void on_websocket_message(AsyncWebSocketClient *client, uint8_t *data, size_t len);
    void on_websocket_event(AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);

    AsyncWebSocket _ws;
    DNSServer _dns_server;
    AsyncWebServer _server;

    NetworkWebsocketHandler _websocket_handler;
    NetworkWebsocketClientHandler _websocket_connected_handler;
    NetworkWebsocketClientHandler _websocket_disconnected_handler;

    Print *_print;
    NetworkingServerConfig *_config;
};

#endif // _NETWORK_SERVER_H