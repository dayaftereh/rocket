#ifndef _DATA_LOG_ENTRY_H
#define _DATA_LOG_ENTRY_H

#include <Arduino.h>

struct __attribute__((packed)) DataLoggerEntry
{
    uint32_t time;  // 4
    uint16_t flight_computer_state; // 2

    float elapsed; // 4

    float rotation_x; // 4
    float rotation_y; // 4
    float rotation_z; // 4

    float raw_acceleration_x; // 4
    float raw_acceleration_y; // 4
    float raw_acceleration_z; // 4

    float acceleration_x; // 4
    float acceleration_y; // 4
    float acceleration_z; // 4

    float world_acceleration_x; // 4
    float world_acceleration_y; // 4
    float world_acceleration_z; // 4

    float zeroed_acceleration_x; // 4
    float zeroed_acceleration_y; // 4
    float zeroed_acceleration_z; // 4

    float velocity_x; // 4
    float velocity_y; // 4
    float velocity_z; // 4
};

#endif // _DATA_LOG_ENTRY_H