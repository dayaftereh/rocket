#ifndef _ROCKET_CONFIG_MESSAGE_H
#define _ROCKET_CONFIG_MESSAGE_H

#include <Arduino.h>

#include "web_message.h"
#include "network_client_config.h"
#include "fligth_computer_config.h"

typedef struct __attribute__((packed)) : public WebMessage, public FlightComputerConfig, public NetworkingClientConfig
{
    int parachute_timeout;
} RocketConfigMessage;

#endif // _ROCKET_CONFIG_MESSAGE_H
