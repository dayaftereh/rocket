#ifndef _DATA_LOGGER_CONFIG_H
#define _DATA_LOGGER_CONFIG_H

typedef struct
{
    bool use_flash;
    uint8_t type;
    uint16_t entry_size;    
    int flash_cs;
    int sd_card_cs;
} DataLoggerConfig;

#endif // _DATA_LOGGER_CONFIG_H