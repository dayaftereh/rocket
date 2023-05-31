
#ifndef _ROCKET_CLIENT_H
#define _ROCKET_CLIENT_H

#include <leds.h>
#include <Print.h>
#include <Arduino.h>
#include <network_client.h>
#include <rocket_config_message.h>

#include "config.h"

class RocketClient
{
public:
    RocketClient();

    bool setup(Config *config, Leds *_leds, Print *print);

    bool update();

private:
    void send_hello();
    void send_config();
    void send_status();

    void on_message(WebMessageType message_type, uint8_t *data, size_t len);

    void on_start_message();
    void on_abort_message();
    void on_unlock_message();
    void on_config_message(uint8_t *data, size_t len);

    NetworkClient _network_client;

    Leds *_leds;
    Print *_print;
    Config *_config;
};

#endif // _ROCKET_CLIENT_H