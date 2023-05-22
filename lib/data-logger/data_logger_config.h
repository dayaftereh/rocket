#ifndef _DATA_LOGGER_CONFIG_H
#define _DATA_LOGGER_CONFIG_H

#include <Arduino.h>

typedef struct
{
    int flash_cs;
    int sd_card_cs;

    bool use_flash;
    bool force_full_flush_erase;
    
    uint8_t type;
    uint16_t entry_size;
} DataLoggerConfig;

#endif // _DATA_LOGGER_CONFIG_H