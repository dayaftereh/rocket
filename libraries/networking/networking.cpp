#include "networking.h"

Networking::Networking()
{
}

bool Networking::setup(NetworkConfig *config, Print *print)
{
    this->_print = print;
    this->_config = config;

    if (config->access_point)
    {
        bool success = this->setup_access_point();
        if (!success)
        {
            this->_print->println("fail to setup access point");
            return false;
        }
    }

    return true;
}

bool Networking::setup_access_point()
{
    bool success = WiFi.softAP(this->_config->ssid, this->_config->password);
    if (!success)
    {
        this->_print->println("fail to soft ap");
        return false;
    }

    IPAddress ip = WiFi.softAPIP();

    Serial.print("AP station ip address: ");
    Serial.println(IP);

    return true;
}