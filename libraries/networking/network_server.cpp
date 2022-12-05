#include "network_server.h"

NetworkServer::NetworkServer() : _server(80), _ws("/api/ws")
{
    this->_websocket_handler = NULL;
    this->_websocket_connected_handler = NULL;
    this->_websocket_disconnected_handler = NULL;
}

bool NetworkServer::setup(NetworkingServerConfig *config, Print *print)
{
    this->_print = print;
    this->_config = config;

    // set to access point mode
    bool success = WiFi.mode(WIFI_AP);
    if (!success)
    {
        this->_print->println("fail to set wifi to ap mode");
        return false;
    }

    // start the soft access point
    success = WiFi.softAP(this->_config->ssid, this->_config->password);
    if (!success)
    {
        this->_print->println("fail to start soft ap");
        return false;
    }

    IPAddress ip = WiFi.softAPIP();
    String mac = WiFi.softAPmacAddress();

    this->_print->print("AP station started [ ");
    this->_print->print(mac);
    this->_print->print(", ");
    this->_print->print(ip);
    this->_print->println(" ]");

    if (this->_config->captive_portal)
    {
        // configure the captive portal
        success = this->setup_captive_portal();
        if (!success)
        {
            return false;
        }
    }

    // rebister the on event for the websocket
    this->_ws.onEvent([=](AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
                      { this->on_websocket_event(client, type, arg, data, len); });

    // add the websocket handler to the server
    this->_server.addHandler(&this->_ws);

    // start the spiffs to serve the web resources
    success = SPIFFS.begin();
    if (!success)
    {
        this->_print->println("fail to begin spiffs");
        return false;
    }

    // register the static resource serve handler with index.html as fallback
    this->_server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html");
    // start the server
    this->_server.begin();

    return true;
}

bool NetworkServer::setup_captive_portal()
{
    // start the dns server with any host
    this->_dns_server.start(53, "*", WiFi.softAPIP());

    this->_server.addHandler(new CaptiveRequestHandler()).setFilter(ON_AP_FILTER);

    return true;
}

void NetworkServer::update()
{
    if (this->_config->captive_portal)
    {
        this->_dns_server.processNextRequest();
    }
}

WebMessageType NetworkServer::message_type(uint8_t *data, size_t len)
{
    if (len < 1)
    {
        return WEB_MESSAGE_UNKNOWN;
    }

    WebMessage *message = reinterpret_cast<WebMessage *>(data);
    return message->message_type;
}

void NetworkServer::on_websocket_event(AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
{
    if (type == WS_EVT_DATA)
    {
        AwsFrameInfo *info = reinterpret_cast<AwsFrameInfo *>(arg);
        if (info->opcode == WS_BINARY)
        {
            this->on_websocket_message(client, data, len);
        }
    }
    else if (type == WS_EVT_CONNECT && this->_websocket_connected_handler != NULL)
    {
        this->_websocket_connected_handler(client);
    }
    else if (type == WS_EVT_DISCONNECT && this->_websocket_disconnected_handler != NULL)
    {
        this->_websocket_disconnected_handler(client);
    }
    else if (type == WS_EVT_ERROR)
    {
        char *message = reinterpret_cast<char *>(data);
        uint16_t error_code = *reinterpret_cast<uint16_t *>(arg);

        this->_print->print("websocket [ ");
        this->_print->print(client->id());
        this->_print->print(" ] has error [ ");
        this->_print->print(error_code);
        this->_print->print(" ] :: ");
        this->_print->println(message);
    }
}

void NetworkServer::on_websocket_message(AsyncWebSocketClient *client, uint8_t *data, size_t len)
{
    WebMessageType message_type = this->message_type(data, len);
    if (message_type < 0)
    {
        return;
    }

    if (this->_websocket_handler != NULL)
    {
        this->_websocket_handler(client, message_type, data, len);
    }
}

void NetworkServer::set_websocket_handler(NetworkWebsocketHandler handler)
{
    this->_websocket_handler = handler;
}

void NetworkServer::set_websocket_connected_handler(NetworkWebsocketClientHandler handler)
{
    this->_websocket_connected_handler = handler;
}

void NetworkServer::set_websocket_disconnected_handler(NetworkWebsocketClientHandler handler)
{
    this->_websocket_disconnected_handler = handler;
}

void NetworkServer::broadcast(uint8_t *data, size_t size)
{
    this->_ws.binaryAll(data, size);
}

void NetworkServer::send(uint8_t *data, size_t size, int num, ...)
{
    va_list arg_l;
    va_start(arg_l, num);

    for (int i = 0; i < num; i++)
    {
        uint32_t id = va_arg(arg_l, uint32_t);
        this->_ws.binary(id, data, size);
    }

    va_end(arg_l);
}