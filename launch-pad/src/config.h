#ifndef _CONFIG
#define _CONFIG

#include <networking_server_config.h>

#define SERIAL_BAUD_RATE 115200

#define EEPROM_CONFIG_SIZE 256

// LED pins
#define RED_LED_PIN 1
#define GREEN_LED_PIN 1

// Voltage
#define VOLTAGE_PIN 1

// Pressure
#define PRESSURE_PIN 1

// Honk
#define HONK_PIN 1

// Valves
#define START_VALVE_PIN 1
#define ABORT_VALVE_PIN 1

typedef struct __attribute__((packed)) : public NetworkingServerConfig {
    // factor and offset to calculate the voltage
    float voltage_factor;
    float voltage_offset;
    // the minimal voltage limit
    float voltage_limit;

    // factor and offset to calculate the pressure
    float pressure_factor;
    float pressure_offset;

    // pressure to reach for the start
    float target_pressure;
    // minimal pressure drop at startup window
    float pressure_drop_limit;
    // timeout between pressure reached and start of the rocket
    int start_window_time; 
} Config;

#endif