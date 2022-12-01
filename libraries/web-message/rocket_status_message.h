#ifndef _ROCKET_STATUS_MESSAGE_H
#define _ROCKET_STATUS_MESSAGE_H

#include <Arduino.h>

#include "web_message.h"

typedef struct __attribute__((packed)) : public WebMessage
{
    int state;
    bool error;
} RocketStatusMessage;

#endif // _ROCKET_STATUS_MESSAGE_H
