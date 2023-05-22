#ifndef _WEB_MESSAGE_H
#define _WEB_MESSAGE_H

#include <Arduino.h>

#include "web_message_type.h"

typedef struct __attribute__((packed))
{
    WebMessageType message_type;
} WebMessage;

#endif // _WEB_MESSAGE_H
