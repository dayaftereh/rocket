#ifndef _LAUNCH_PAD_SERVER_H
#define _LAUNCH_PAD_SERVER_H

#include <leds.h>
#include <Print.h>
#include <network_server.h>

#include "config_manager.h"
#include "launch_computer.h"

class LaunchPadServer
{
public:
    LaunchPadServer();

    bool setup(ConfigManager *config_manager, LaunchComputer *launch_computer, Leds *leds, Print *print);
    void update();

private:
    void on_disconnected(AsyncWebSocketClient *client);
    void on_message(int id, uint8_t messageType, uint8_t *data, size_t len);

    int _rocket_client_id;
    int _control_center_client_id;

    NetworkServer _network_server;

    Leds *_leds;
    Print *_print;
    ConfigManager *_config_manager;
    LaunchComputer *_launch_computer;
};

#endif // _LAUNCH_PAD_SERVER_H