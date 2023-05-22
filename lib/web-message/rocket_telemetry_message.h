#ifndef _ROCKET_TELEMETRY_MESSAGE_H
#define _ROCKET_TELEMETRY_MESSAGE_H

#include <Arduino.h>

#include "web_message.h"

typedef struct __attribute__((packed)) : public WebMessage
{
    unsigned long time; // 4

    float elapsed; // 4

    float voltage;  // 4
    float altitude; // 4

    float rotation_x; // 4
    float rotation_y; // 4
    float rotation_z; // 4

    float gyroscope_x; // 4
    float gyroscope_y; // 4
    float gyroscope_z; // 4

    float acceleration_x; // 4
    float acceleration_y; // 4
    float acceleration_z; // 4

    float magnetometer_x; // 4
    float magnetometer_y; // 4
    float magnetometer_z; // 4 

} RocketTelemetryMessage;

#endif // _ROCKET_TELEMETRY_MESSAGE_H
