#ifndef _CONFIG_H
#define _CONFIG_H

#define RUNDIAGNOSTIC

#include <Arduino.h>
#include <madgwick_config.h>

// Serial -----------------------------------------------
#define SERIAL_BAUD_RATE 115200

// AccessPoint -----------------------------------------------
#define ACCESS_POINT_SSID "Spring"
#define ACCESS_POINT_PASSWD "123456789"
#define ACCESS_POINT_CHANNEL 7

// FlightObserver -----------------------------------------------
#define FLIGHT_OBSERVER_TERMINATION_TIMEOUT (30000)

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
#define RAD_2_DEG (180.0 / PI)
#define DEG_2_RAD (PI / 180.0)

enum IMUUpAxes
{
  IMU_AXES_X = 1,
  IMU_AXES_Y = 2,
  IMU_AXES_Z = 3
};

// Config struct for the eeprom
struct Config : public MadgwickConfig
{
  // parachute
  bool parachute_servo;
  int parachute_timeout;
  int parachute_servo_open_angle;
  int parachute_servo_close_angle; 

  // rotation
  float rotation_x;
  float rotation_y;
  float rotation_z;

  // launch condition values
  float launch_angle;
  float launch_acceleration;

  // lift off
  float lift_off_velocity_threshold;

  // apogee
  float apogee_velocity_threshold;
  float apogee_altitude_threshold;
  float apogee_orientation_threshold;

  // landing
  float landing_acceleration;
  float landing_altitude_threshold;
  float landing_orientation_timeout;
  float landing_orientation_threshold;

};

#endif // _CONFIG_H
