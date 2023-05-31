#include "network_client.h"

NetworkClient::NetworkClient()
{
}

bool NetworkClient::setup(NetworkingClientConfig *config, Leds *leds, Print *print)
{
    this->_leds = leds;
    this->_print = print;
    this->_config = config;

    // set to station mode
    bool success = WiFi.mode(WIFI_STA);
    if (!success)
    {
        this->_print->println("fail to set wifi to station mode");
        return false;
    }

    // start the wifi connecting
    wl_status_t status = WiFi.begin(this->_config->ssid, this->_config->password);

    // wait for connected
    success = this->wait_for_wifi_connected();
    if (!success)
    {
        return false;
    }

    IPAddress ip = WiFi.localIP();
    String mac = WiFi.macAddress();

    this->_print->print("Wifi station connected with [ ");
    this->_print->print(mac);
    this->_print->print(", ");
    this->_print->print(ip);
    this->_print->println(" ]");

    IPAddress broadcastIP = WiFi.broadcastIP();

    this->_print->print("Using broadcastIP for web-socket connection [ ");
    this->_print->print(broadcastIP);
    this->_print->println(" ]");

    // register for websocket events
    this->_websocket.onEvent([=](WStype_t type, uint8_t *data, size_t len)
                             { this->on_websocket_event(type, data, len); });

    // connect the webcoket to the sever
    this->_websocket.begin(broadcastIP, 80, "/api/ws");
    // setup reconnect interval
    this->_websocket.setReconnectInterval(5000);

    return true;
}

bool NetworkClient::wait_for_wifi_connected()
{
    this->_print->print("connecting to wifi [ ");
    this->_print->print(this->_config->ssid);
    this->_print->print(" ]");

    uint32_t start_time = millis();
    while (WiFi.status() != WL_CONNECTED)
    {

        uint32_t elapsed = millis() - start_time;
        if (elapsed > WIFI_CONNECT_TIMEOUT)
        {
            this->_print->print(" failed, because timeouted after [ ");
            this->_print->print(WIFI_CONNECT_TIMEOUT);
            this->_print->println(" ]");
            return false;
        }

        this->_print->print(".");
        this->_leds->sleep(1000);
    }

    return true;
}

void NetworkClient::on_websocket_event(WStype_t type, uint8_t *data, size_t len)
{
    switch (type)
    {
    case WStype_CONNECTED:
        this->on_websocket_connected();
        return;
    case WStype_DISCONNECTED:
        this->on_websocket_disconnected();
        return;
    case WStype_BIN:
        this->on_websocket_message(data, len);
        return;
    }
}

void NetworkClient::on_websocket_connected()
{
    if (this->_websocket_connected_handler == NULL)
    {
        return;
    }
    this->_websocket_connected_handler();
}

void NetworkClient::on_websocket_disconnected()
{
    if (this->_websocket_disconnected_handler == NULL)
    {
        return;
    }
    this->_websocket_disconnected_handler();
}

WebMessageType NetworkClient::message_type(uint8_t *data, size_t len)
{
    if (len < 1)
    {
        return WEB_MESSAGE_UNKNOWN;
    }

    WebMessage *message = reinterpret_cast<WebMessage *>(data);
    return message->message_type;
}

void NetworkClient::on_websocket_message(uint8_t *data, size_t len)
{
    if (this->_websocket_message_handler == NULL)
    {
        return;
    }
    // get the message type
    WebMessageType message_type = this->message_type(data, len);
    if (message_type < 0)
    {
        return;
    }

    // notify message handler
    this->_websocket_message_handler(message_type, data, len);
}

void NetworkClient::set_websocket_message_handler(ClientWebSocketMessageHandler websocket_message_handler) {
    this->_websocket_message_handler = websocket_message_handler;
}

void NetworkClient::set_websocket_connected_handler(ClientWebSocketConnectedHandler websocket_connected_handler) {
    this->_websocket_connected_handler = websocket_connected_handler;
}

void NetworkClient::set_websocket_disconnected_handler(ClientWebSocketDisconnectedHandler websocket_disconnected_handler) {
    this->_websocket_disconnected_handler = websocket_disconnected_handler;
}

void  NetworkClient::send(uint8_t *data, size_t len) {
    this->_websocket.sendBIN(data, len);
}

void NetworkClient::update()
{
    // update the websocket
    this->_websocket.loop();
}