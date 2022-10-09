#include "network_server.h"

NetworkServer::NetworkServer() : _server(80), _ws("/api/ws")
{
}

bool NetworkServer::setup(NetworkConfig *config, Print *print)
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
    String mac = Wifif.softAPmacAddress();

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
    this->server.addHandler(&this->_ws);

    // start the spiffs to serve the web resources
    success = SPIFFS.begin();
    if (!success)
    {
        this->_print->println("fail to begin spiffs");
        return false;
    }

    // register the static resource serve handler with index.html as fallback
    this->server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html");
    // start the server
    this->_server.begin();

    return true;
}

bool NetworkServer::setup_captive_portal()
{
    // start the dns server with any host
    this->_dns_server..start(53, "*", WiFi.softAPIP());

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

int NetworkServer::message_type(uint8_t *data, size_t len)
{
    if (len < 1)
    {
        return -1;
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
            this->on_websocket_event(client, data, len);
        }
    }
}

void NetworkServer::on_websocket_message(AsyncWebSocketClient *client, uint8_t *data, size_t len)
{
    int message_type = this->message_type(data, len);
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