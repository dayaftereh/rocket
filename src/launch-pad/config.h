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
    // ######### IO #########
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

    // ######### LaunchComputer #########

    // the launch computer start timeout in seconds
    float startup_timeout;

    // state to check if the rocket is connected
    uint16_t rocket_connected_state;
    // timeout to wait for rocket connected in seconds
    float rocket_connecting_timeout;
    // threshold of the last signal duration in seconds
    float rocket_signal_elapsed_threshold;

    // timeout how long the pressurising takes in seconds
    float pressurising_timeout;
    // pressure to reach for the start
    float target_pressure;
    // minimal pressure drop at startup window
    float pressure_drop_limit;

    // timeout between pressure reached and start of the rocket to chill the tank in seconds
    float tank_chill_duration;

    // the timeout to reach the rocket startup state in seconds
    float rocket_startup_timeout;
    // the state to reach by rocket to be in startup
    uint16_t rocket_startup_state;

    // the startup countdown in seconds
    float countdown;

    // timeout after lift off in seconds
    float lift_of_timeout;

    // ######### StatusMessage #########

    uint32_t status_message_update;
} Config;

#endif