#include "network_server.h"

NetworkServer::NetworkServer()
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

    return true;
}

void NetworkServer::update()
{
}