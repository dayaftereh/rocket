#ifndef _NETWORKING_CONFIG_H
#define _NETWORKING_CONFIG_H

#include <Arduino.h>

typedef struct
{
    bool access_point;
    char *ssid;
    char *password;
} NetworkConfig;

#endif // _NETWORKING_CONFIG_H