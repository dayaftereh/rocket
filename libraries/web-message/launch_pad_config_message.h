#ifndef _LAUNCH_PAD_CONFIG_MESSAGE_H
#define _LAUNCH_PAD_CONFIG_MESSAGE_H

#include <Arduino.h>

#include "web_message.h"
#include "networking_server_config.h"

typedef struct __attribute__((packed)) : public WebMessage, public NetworkingServerConfig
{
    // factor and offset to calculate the voltage
    float voltage_factor;
    float voltage_offset;
    // the minimal voltage limit
    float voltage_limit;

    // factor and offset to calculate the pressure
    float pressure_factor;
    float pressure_offset;

    // pressure to reach for the start
    float target_pressure;
    // minimal pressure drop at startup window
    float pressure_drop_limit;
    // timeout between pressure reached and start of the rocket
    int start_window_time; 
} LaunchPadConfigMessage;

#endif // _LAUNCH_PAD_CONFIG_MESSAGE_H
