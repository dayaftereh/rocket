#ifndef _NETWORKING_CONFIG_H
#define _NETWORKING_CONFIG_H

#include <Arduino.h>

typedef struct
{
    char *ssid;
    char *password;
} NetworkingConfig;

#endif // _NETWORKING_CONFIG_H