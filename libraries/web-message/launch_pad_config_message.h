#ifndef _LAUNCH_PAD_CONFIG_MESSAGE_H
#define _LAUNCH_PAD_CONFIG_MESSAGE_H

#include <Arduino.h>

#include "web_message.h"
#include "networking_server_config.h"

typedef struct __attribute__((packed)) : public WebMessage, public NetworkingServerConfig
{

} LaunchPadConfigMessage;

#endif // _LAUNCH_PAD_CONFIG_MESSAGE_H
