#ifndef _NETWORKING_SERVER_CONFIG_H
#define _NETWORKING_SERVER_CONFIG_H

#include "networking_config.h"

typedef struct __attribute__((packed)) : public NetworkingConfig
{
    bool captive_portal;
} NetworkingServerConfig;

#endif // _NETWORKING_SERVER_CONFIG_H