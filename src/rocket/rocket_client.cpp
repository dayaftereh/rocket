#include "rocket_client.h"

RocketClient::RocketClient()
{
}

bool RocketClient::setup(Config *config, Leds *leds, Print *print)
{
    this->_leds = leds;
    this->_print = print;
    this->_config = config;

    // set the message handler
    this->_network_client.set_websocket_message_handler([=](WebMessageType message_type, uint8_t *data, size_t len)
                                                        { this->on_message(message_type, data, len); });

    // setup the network client
    bool success = this->_network_client.setup(config, leds, print);
    if (!success)
    {
        this->_print->println("fail to setup network client");
        return false;
    }

    // notify launchpad to be the rocket
    this->send_hello();

    return true;
}

void RocketClient::send_hello()
{
    WebMessage message;
    message.message_type = HELLO_ROCKET_MESSAGE_TYPE;

    uint8_t *data = reinterpret_cast<uint8_t *>(&message);
    this->_network_client.send(data, sizeof(message));
}

void RocketClient::on_message(WebMessageType message_type, uint8_t *data, size_t len)
{
    switch (message_type)
    {
    case ROCKET_START_MESSAGE_TYPE:
        this->on_start_message();
        return;
    case ROCKET_ABORT_MESSAGE_TYPE:
        this->on_abort_message();
        return;
    case ROCKET_UNLOCK_MESSAGE_TYPE:
        this->on_unlock_message();
        return;
    case ROCKET_CONFIG_MESSAGE_TYPE:
        this->on_config_message(data, len);
        return;
    case REQUEST_ROCKET_CONFIG_MESSAGE_TYPE:
        this->send_config();
        return;
    }
}

void RocketClient::on_start_message()
{
}

void RocketClient::on_abort_message()
{
}

void RocketClient::on_unlock_message()
{
}

void RocketClient::on_config_message(uint8_t *data, size_t len)
{
    RocketConfigMessage *message = reinterpret_cast<RocketConfigMessage *>(data);

    // TODO UpdateConfig
}

void RocketClient::send_config()
{
    RocketConfigMessage message;
    message.message_type = ROCKET_CONFIG_MESSAGE_TYPE;

    // TODO Set Config

    uint8_t *data = reinterpret_cast<uint8_t *>(&message);
    this->_network_client.send(data, sizeof(message));
}

bool RocketClient::update()
{
    this->_network_client.update();

    return true;
}