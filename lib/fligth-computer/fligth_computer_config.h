#ifndef _FLIGHT_COMPUTER_CONFIG_H
#define _FLIGHT_COMPUTER_CONFIG_H

#include <Arduino.h>

typedef struct
{
    float launch_acceleration_threshold;

    float lift_off_velocity_threshold;

    float meco_acceleration_threshold;

    float apogee_velocity_threshold;
    uint32_t apogee_force_timeout;

    int landed_orientation_count;
    float landed_orientation_threshold;
    float landed_acceleration_threshold;
    uint32_t landed_change_detect_timeout;

    uint32_t flight_terminate_timeout;

} FlightComputerConfig;

#endif // _FLIGHT_COMPUTER_CONFIG_H