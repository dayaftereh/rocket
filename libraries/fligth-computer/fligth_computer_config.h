#ifndef _FLIGHT_COMPUTER_CONFIG_H
#define _FLIGHT_COMPUTER_CONFIG_H

typedef struct
{
    float launch_acceleration_threshold;

    float lift_off_velocity_threshold;

    float meco_acceleration_threshold;

} FlightComputerConfig;

#endif // _FLIGHT_COMPUTER_CONFIG_H