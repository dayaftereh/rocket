#ifndef _NETWORKING_CONFIG_H
#define _NETWORKING_CONFIG_H

#include <Arduino.h>

typedef struct __attribute__((packed))
{
    char ssid[25];
    char password[25];
} NetworkingConfig;

#endif // _NETWORKING_CONFIG_H