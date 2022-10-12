#ifndef _NETWORKING_CLIENT_CONFIG_H
#define _NETWORKING_CLIENT_CONFIG_H

#include "networking_config.h"

typedef struct __attribute__((packed)) : public NetworkingConfig
{
} NetworkingClientConfig;

#endif // _NETWORKING_CLIENT_CONFIG_H