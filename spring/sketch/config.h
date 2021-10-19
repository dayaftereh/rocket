#ifndef _CONFIG_H
#define _CONFIG_H

#include <Arduino.h>

// Serial -----------------------------------------------
#define SERIAL_BAUD_RATE 9600

// Status -----------------------------------------------
#define STATUS_LED_1_PIN D3
#define STATUS_INIT_LED_TIMEOUT 500

// DataLogger -----------------------------------------------
#define DATA_LOGGER_SD_CS D8
#define DATA_LOGGER_FLASH_CS D0

// ConfigManager -----------------------------------------------
#define EEPROM_CONFIG_SIZE 512

// VoltageMeasurement -----------------------------------------------
#define VOLTAGE_MEASUREMENT_PIN A0

// Config struct for the eeprom
typedef struct {

} Config;

#endif // _CONFIG_H
