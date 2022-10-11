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
    this->_network_server.set_websocket_handler([=](AsyncWebSocketClient *client, uint8_t message_type, uint8_t *data, size_t len)
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

void LaunchPadServer::on_message(int id, uint8_t messageType, uint8_t *data, size_t len)
{
}

void LaunchPadServer::update()
{
}