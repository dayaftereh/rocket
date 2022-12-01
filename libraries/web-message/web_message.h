#ifndef _WEB_MESSAGE_H
#define _WEB_MESSAGE_H

#include <Arduino.h>

typedef struct __attribute__((packed))
{
    uint8_t message_type;
} WebMessage;

#endif // _WEB_MESSAGE_H
