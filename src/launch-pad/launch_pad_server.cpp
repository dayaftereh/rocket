#include "launch_pad_server.h"

LaunchPadServer::LaunchPadServer()
{
}

bool LaunchPadServer::setup(ConfigManager *config_manager, LaunchComputer *launch_computer, Leds *leds, Print *print)
{
    this->_leds = leds;
    this->_print = print;
    this->_config_manager = config_manager;
    this->_launch_computer = launch_computer;

    // resetting rocket and control-center client ids
    this->_rocket_client_id = -1;
    this->_control_center_client_id = -1;

    // register the disconnect
    this->_network_server.set_websocket_disconnected_handler([=](AsyncWebSocketClient *client)
                                                             { this->on_disconnected(client); });
    // register the websocket message handler
    this->_network_server.set_websocket_handler([=](AsyncWebSocketClient *client, WebMessageType message_type, uint8_t *data, size_t len)
                                                { 
                                                    int id = (int)client->id();
                                                    this->on_message(id, message_type, data, len); });

    // get the current config
    Config *config = config_manager->get_config();

    // setup the network server
    bool success = this->_network_server.setup(config, print);
    if (!success)
    {
        this->_print->println("fail to setup network server");
        return false;
    }

    return true;
}

void LaunchPadServer::on_disconnected(AsyncWebSocketClient *client)
{
    int id = (int)client->id();

    if (id == this->_rocket_client_id)
    {
        // reset the rocket id
        this->_rocket_client_id = -1;
    }
    else if (id == this->_control_center_client_id)
    {
        // reset the control center id
        this->_control_center_client_id = -1;
    }
}

void LaunchPadServer::on_message(int id, WebMessageType messageType, uint8_t *data, size_t len)
{
    switch (messageType)
    {
        // Hello Messages
    case HELLO_ROCKET_MESSAGE_TYPE:
        this->on_hello_rocket(id);
        return;
    case HELLO_CONTROL_CENTER_MESSAGE_TYPE:
        this->on_hello_control_center(id);
        return;
        // LaunchPad
    case LAUNCH_PAD_ABORT_MESSAGE_TYPE:
        this->on_launch_pad_abort();
        return;
    case LAUNCH_PAD_START_MESSAGE_TYPE:
        this->on_launch_pad_start();
        return;
    case REQUEST_LAUNCH_PAD_CONFIG_MESSAGE_TYPE:
        this->send_launch_pad_config();
        return;
    case LAUNCH_PAD_CONFIG_MESSAGE_TYPE:
        this->on_launch_pad_config(data, len);
        return;
        // Rocket
    case ROCKET_STATUS_MESSAGE_TYPE:
        this->on_rocket_status(data, len);
        return;
    case ROCKET_TELEMETRY_MESSAGE_TYPE:
        this->send_to_control_center(data, len);
        return;
    case ROCKET_CONFIG_MESSAGE_TYPE:
        this->on_rocket_config(id, data, len);
        return;
    case REQUEST_ROCKET_CONFIG_MESSAGE_TYPE:
        this->send_to_rocket(data, len);
        return;
    }
}

void LaunchPadServer::send_to_rocket(uint8_t *data, size_t len)
{
    // check if the rocket connected
    if (this->_rocket_client_id < 0)
    {
        return;
    }

    // send the message to the rocket
    this->_network_server.send(data, len, this->_rocket_client_id);
}

void LaunchPadServer::send_to_control_center(uint8_t *data, size_t len)
{
    // check if the control center connected
    if (this->_control_center_client_id < 0)
    {
        return;
    }

    // send the message to the control center
    this->_network_server.send(data, len, this->_control_center_client_id);
}

void LaunchPadServer::on_hello_rocket(int id)
{
    this->_print->print("hello rocket on client id [ ");
    this->_print->print(id);
    this->_print->print(" ]");

    this->_rocket_client_id = id;
}

void LaunchPadServer::on_hello_control_center(int id)
{
    this->_print->print("hello control-center on client id [ ");
    this->_print->print(id);
    this->_print->print(" ]");

    this->_control_center_client_id = id;
}

void LaunchPadServer::send_launch_pad_status()
{
    LaunchPadStatusMessage message;
    message.message_type = LAUNCH_PAD_STATUS_MESSAGE_TYPE;
    message.connected = this->_rocket_client_id >= 0;

    uint8_t *data = reinterpret_cast<uint8_t *>(&message);
    this->send_to_control_center(data, sizeof(message));
}

void LaunchPadServer::send_launch_pad_config()
{
    LaunchPadConfigMessage message;
    message.message_type = LAUNCH_PAD_CONFIG_MESSAGE_TYPE;

    Config *config = this->_config_manager->get_config();

    message.captive_portal = config->captive_portal;

    std::copy(std::begin(config->ssid), std::end(config->ssid), std::begin(message.ssid));
    std::copy(std::begin(config->password), std::end(config->password), std::begin(message.password));

    uint8_t *data = reinterpret_cast<uint8_t *>(&message);
    this->send_to_control_center(data, sizeof(message));
}

void LaunchPadServer::on_launch_pad_config(uint8_t *data, size_t len)
{
    // get the message
    LaunchPadConfigMessage *message = reinterpret_cast<LaunchPadConfigMessage *>(data);

    Config *config = this->_config_manager->get_config();

    config->captive_portal = message->captive_portal;

    std::copy(std::begin(message->ssid), std::end(message->ssid), std::begin(config->ssid));
    std::copy(std::begin(message->password), std::end(message->password), std::begin(config->password));

    // write the new launch-pad config to eeprom
    this->_config_manager->write();
    // send the changed launch-pad configuration
    this->send_launch_pad_config();
}

void LaunchPadServer::on_launch_pad_start()
{
    // start the launch computer
    this->_launch_computer->start();
}

void LaunchPadServer::on_launch_pad_abort()
{
    // abort the launch computer
    this->_launch_computer->abort();
}

void LaunchPadServer::on_rocket_status(uint8_t *data, size_t len)
{
    // forward the message to control center
    this->send_to_control_center(data, len);
    // get the rocket status
    RocketStatusMessage *message = reinterpret_cast<RocketStatusMessage *>(data);
    // notify launch computer about rocket status
    this->_launch_computer->rocket_status(message->error, message->state);
}

void LaunchPadServer::on_rocket_config(int id, uint8_t *data, size_t len)
{
    // check if the rocket config coming from the rocket
    if (id == this->_rocket_client_id)
    {
        // then forward the rocket config to control center
        this->send_to_control_center(data, len);
    }
    else if (id == this->_control_center_client_id)
    {
        // if the rocket config from the control center, then forward to the rocket
        this->send_to_rocket(data, len);
    }
}

void LaunchPadServer::send_rocket_abort()
{
    WebMessage message;
    message.message_type = ROCKET_ABORT_MESSAGE_TYPE;

    uint8_t *data = reinterpret_cast<uint8_t *>(&message);
    this->send_to_rocket(data, sizeof(message));
}

void LaunchPadServer::send_rocket_start()
{
    WebMessage message;
    message.message_type = ROCKET_START_MESSAGE_TYPE;

    uint8_t *data = reinterpret_cast<uint8_t *>(&message);
    this->send_to_rocket(data, sizeof(message));
}

void LaunchPadServer::send_rocket_unlock()
{
    WebMessage message;
    message.message_type = ROCKET_UNLOCK_MESSAGE_TYPE;

    uint8_t *data = reinterpret_cast<uint8_t *>(&message);
    this->send_to_rocket(data, sizeof(message));
}

void LaunchPadServer::rocket_start()
{
    this->send_rocket_start();
}

void LaunchPadServer::rocket_abort()
{
    this->send_rocket_abort();
}

void LaunchPadServer::rocket_unlock()
{
    this->send_rocket_unlock();
}