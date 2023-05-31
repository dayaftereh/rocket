#ifndef _NETWORK_CLIENT_H
#define _NETWORK_CLIENT_H

#include <WiFi.h>
#include <Print.h>
#include <Arduino.h>
#include <WebSockets.h>
#include <WebSocketsClient.h>

#include "leds.h"
#include "network_client_config.h"

#include "../web-message/web_message.h"

#define WIFI_CONNECT_TIMEOUT (1000 * 30)

typedef std::function<void()> ClientWebSocketConnectedHandler;
typedef std::function<void()> ClientWebSocketDisconnectedHandler;
typedef std::function<void(WebMessageType message_type, uint8_t *data, size_t len)> ClientWebSocketMessageHandler;

class NetworkClient
{
public:
    NetworkClient();

    bool setup(NetworkingClientConfig *config, Leds *leds, Print *print);
    void update();

    void send(uint8_t *data, size_t len);

    void set_websocket_message_handler(ClientWebSocketMessageHandler websocket_message_handler);
    void set_websocket_connected_handler(ClientWebSocketConnectedHandler websocket_connected_handler);
    void set_websocket_disconnected_handler(ClientWebSocketDisconnectedHandler websocket_disconnected_handler);

private:
    bool wait_for_wifi_connected();

    WebMessageType message_type(uint8_t *data, size_t len);

    void on_websocket_connected();
    void on_websocket_disconnected();
    void on_websocket_message(uint8_t *data, size_t len);
    void on_websocket_event(WStype_t type, uint8_t *data, size_t len);

    WebSocketsClient _websocket;
    ClientWebSocketMessageHandler _websocket_message_handler;
    ClientWebSocketConnectedHandler _websocket_connected_handler;
    ClientWebSocketDisconnectedHandler _websocket_disconnected_handler;

    Leds *_leds;
    Print *_print;
    NetworkingClientConfig *_config;
};

#endif // _NETWORK_CLIENT_H