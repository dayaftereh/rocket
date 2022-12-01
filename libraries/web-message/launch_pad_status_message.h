#ifndef _LAUNCH_PAD_STATUS_MESSAGE_H
#define _LAUNCH_PAD_STATUS_MESSAGE_H

#include <Arduino.h>

#include "web_message.h"

typedef struct __attribute__((packed)) : public WebMessage
{
    int state;
    bool error;
    bool connected;
} LaunchPadStatusMessage;

#endif // _LAUNCH_PAD_STATUS_MESSAGE_H