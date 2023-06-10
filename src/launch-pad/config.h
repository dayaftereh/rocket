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
#define ABORT_VALVE_PIN 1
#define LAUNCH_VALVE_PIN 1

typedef struct __attribute__((packed)) : public NetworkingServerConfig
{
    // factor and offset to calculate the voltage
    float voltage_factor;
    float voltage_offset;

    // the minimal voltage limit
    float voltage_limit;

    // factor and offset to calculate the pressure
    float pressure_factor;
    float pressure_offset;

    // the duration in seconds to honk
    float honk_duration;
    // the duration in seconds the launch valve is opened
    float launch_valve_opened_duration;

    // pressure threshold to close the abort valve
    float abort_close_pressure_threshold;

    // the launch computer start timeout
    float startup_timeout;

    // state to check if the rocket is connected
    int rocket_connected_state;
    // timeout to wait for rocket connected
    float rocket_connecting_timeout;
    // threshold of the last signal duration in seconds
    float rocket_signal_elapsed_threshold;

    // timeout how long the pressurising takes
    float pressurising_timeout;
    // pressure to reach for the start
    float target_pressure;
    // minimal pressure drop at startup window
    float pressure_drop_limit;

    // timeout between pressure reached and start of the rocket
    float tank_chill_duration;

    // the timeout to reach the rocket startup state
    int rocket_startup_timeout;
    // the state to reach by rocket to be in startup
    int rocket_startup_state;

} Config;

#endif