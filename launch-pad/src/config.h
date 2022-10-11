#ifndef _CONFIG
#define _CONFIG

#include <networking_server_config.h>

#define SERIAL_BAUD_RATE 115200

#define EEPROM_CONFIG_SIZE 256

// LED pins
#define RED_LED_PIN 1
#define GREEN_LED_PIN 1

typedef struct : public NetworkingServerConfig {
    
} Config;

#endif