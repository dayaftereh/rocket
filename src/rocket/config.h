#ifndef _CONFIG_H
#define _CONFIG_H

#include <Arduino.h>
#include <network_client_config.h>
#include <fligth_computer_config.h>
#include <parachute_manager_config.h>

#define SERIAL_BAUD_RATE 115200

#define EEPROM_CONFIG_SIZE 512

#define RED_LED_PIN 2
#define GREEN_LED_PIN 4

#define MADGWICK_KI (0.0)
#define MADGWICK_KP (15.0)

#define ACCELERATION_X_OFFSET (-0.5)
#define ACCELERATION_Y_OFFSET (0.0)
#define ACCELERATION_Z_OFFSET (-2.6)

#define IMU_X_ROTATION (DEG_TO_RAD * -75.1)
#define IMU_Y_ROTATION (DEG_TO_RAD * 4.3)
#define IMU_Z_ROTATION (DEG_TO_RAD * 0)

#define DATA_LOGGER_LOOP_TYPE 1
#define DATA_LOGGER_USE_FLASH false
#define DATA_LOGGER_FLUSH_CS 17
#define DATA_LOGGER_SD_CARD_CS 5

#define LOOP_CONTROLLER_INIT_TIMEOUT (10 * 1000)

#define IO_L1_PIN 32
#define IO_L2_PIN 33
#define IO_VOLTAGE_PIN 34

typedef struct __attribute__((packed)) : public FlightComputerConfig, public NetworkingClientConfig, public ParachuteManagerConfig
{
    uint32_t status_message_update;
    uint32_t telemetry_message_update;
} Config;

#endif // _CONFIG_H