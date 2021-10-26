#ifndef _CONFIG_H
#define _CONFIG_H

#include <Arduino.h>

// Serial -----------------------------------------------
#define SERIAL_BAUD_RATE 9600

// AccessPoint -----------------------------------------------
#define ACCESS_POINT_SSID "Spring"
#define ACCESS_POINT_PASSWD "123456789"
#define ACCESS_POINT_CHANNEL 7

// RemoteServer -----------------------------------------------
#define REMOTE_SERVER_PORT 80
#define REMOTE_SERVER_ADDRESS "192.168.10.1"
#define REMOTE_SERVER_GATEWAY "192.168.10.1"
#define REMOTE_SERVER_SUBNET_MASK "255.255.255.0"
#define REMOTE_SERVER_BROADCAST_TIMEOUT (100)

// Status -----------------------------------------------
#define STATUS_LED_1_PIN D3
#define STATUS_INIT_LED_TIMEOUT 500
#define STATUS_FINALIZE_LED_TIMEOUT 200

// DataLogger -----------------------------------------------
#define DATA_LOGGER_USE_FLASH false
#define DATA_LOGGER_SD_CS D8
#define DATA_LOGGER_FLASH_CS D0

// ConfigManager -----------------------------------------------
#define EEPROM_CONFIG_SIZE 512

// VoltageMeasurement -----------------------------------------------
#define VOLTAGE_MEASUREMENT_PIN A0

// AltitudeManager -----------------------------------------------
#define ALTITUDE_MANAGER_ZERO_READINGS 500
#define ALTITUDE_MANAGER_WARM_UP_TIMEOUT 5000

// MotionManager -----------------------------------------------
#define MOTION_MANAGER_CALIBRATION_READS 500

// ParachuteManager -----------------------------------------------
#define PARACHUTE_MANAGER_PIN D4

// Constants -----------------------------------------------
#define GRAVITY_OF_EARTH (9.80665F)
#define RAD_2_DEG (180.0/PI)

// Config struct for the eeprom
typedef struct {
  // timeout for the parachute opening
  int parachute_timeout;

  // coefficient between gyro and acceleration
  float gyro_acceleration_coefficient;

} Config;

#endif // _CONFIG_H
