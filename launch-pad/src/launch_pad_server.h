#ifndef _LAUNCH_PAD_SERVER_H
#define _LAUNCH_PAD_SERVER_H

#include <leds.h>
#include <Print.h>
#include <network_server.h>

#include "rocket.h"
#include "web_messages.h"
#include "config_manager.h"
#include "launch_computer.h"

class LaunchPadServer: public Rocket
{
public:
    LaunchPadServer();

    bool setup(ConfigManager *config_manager, LaunchComputer *launch_computer, Leds *leds, Print *print);

    void rocket_start();
    void rocket_abort();
    void rocket_unlock();

private:
    void on_disconnected(AsyncWebSocketClient *client);
    void on_message(int id, uint8_t messageType, uint8_t *data, size_t len);
    void on_hello_rocket(int id);
    void on_hello_control_center(int id);
    void on_set_launch_pad_config(uint8_t *data, size_t len);
    void on_rocket_status(uint8_t *data, size_t len);

    void send_launch_pad_status();
    void send_launch_pad_config();

    void send_rocket_start();
    void send_rocket_abort();
    void send_rocket_unlock();

    void send_to_rocket(uint8_t *data, size_t len);
    void send_to_control_center(uint8_t *data, size_t len);

    int _rocket_client_id;
    int _control_center_client_id;

    NetworkServer _network_server;

    Leds *_leds;
    Print *_print;
    ConfigManager *_config_manager;
    LaunchComputer *_launch_computer;
};

#endif // _LAUNCH_PAD_SERVER_H