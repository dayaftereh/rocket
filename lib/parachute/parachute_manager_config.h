#ifndef _PARACHUTE_MANAGER_CONFIG_H
#define _PARACHUTE_MANAGER_CONFIG_H

#include <Arduino.h>

typedef struct
{
    uint8_t parachute_pin;
    uint8_t parachute_channel;
    uint32_t parachute_frequency;
    uint32_t parachute_open_duty;
    uint32_t parachute_close_duty;
} ParachuteManagerConfig;

#endif // _PARACHUTE_MANAGER_CONFIG_H