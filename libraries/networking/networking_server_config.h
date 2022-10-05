#ifndef _NETWORKING_SERVER_CONFIG
#define _NETWORKING_SERVER_CONFIG

#include "networking_config.h"

typedef struct : public NetworkingConfig
{
    bool captive_portal;
} NetworkingServerConfig;

#endif // _NETWORKING_SERVER_CONFIG