#ifndef _WEB_MESSAGES_H
#define _WEB_MESSAGES_H

#include <Arduino.h>
#include <web_message.h>

#include "config.h"

enum WebMessageType : uint8_t
{
    HELLO_ROCKET_MESSAGE_TYPE = 1,
    HELLO_CONTROL_CENTER_MESSAGE_TYPE,

    // Launch-Pad
    LAUNCH_PAD_STATUS_MESSAGE_TYPE,
    LAUNCH_PAD_CONFIG_MESSAGE_TYPE,
    GET_LAUNCH_PAD_CONFIG_MESSAGE_TYPE,
    SET_LAUNCH_PAD_CONFIG_MESSAGE_TYPE,

    // Rocket
    ROCKET_START_MESSAGE_TYPE,
    ROCKET_ABORT_MESSAGE_TYPE,
    ROCKET_UNLOCK_MESSAGE_TYPE,
    ROCKET_STATUS_MESSAGE_TYPE,
    ROCKET_TELEMETRY_MESSAGE_TYPE,
    ROCKET_FLIGHT_PLAN_MESSAGE_TYPE,
    GET_ROCKET_FLIGHT_PLAN_MESSAGE_TYPE,
    SET_ROCKET_FLIGHT_PLAN_MESSAGE_TYPE,
};

typedef struct __attribute__((packed)) : public WebMessage
{
    int state;
    bool error;
    bool connected;
} LaunchPadStatusMessage;

typedef struct __attribute__((packed)) : public WebMessage, public Config
{
} LaunchPadConfigMessage;

typedef struct __attribute__((packed)) : public WebMessage
{
    int state;
    bool error;
} RocketStatusMessage;

#endif // _WEB_MESSAGES_H
