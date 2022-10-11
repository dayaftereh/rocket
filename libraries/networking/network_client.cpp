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

void NetworkClient::update()
{
}