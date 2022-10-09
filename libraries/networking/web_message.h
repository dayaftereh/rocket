#ifndef _WEB_MESSAGE
#define _WEB_MESSAGE

#include <Arduino.h>

typedef struct __attribute__ ((packed)) WebMessage
{
    uint8_t message_type;
};

#endif
