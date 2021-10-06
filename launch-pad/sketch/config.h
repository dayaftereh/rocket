#ifndef _CONFIG_H
#define _CONFIG_H

// Serial -----------------------------------------------
#define SERIAL_BAUD_RATE 9600

// VALVE -----------------------------------------------
#define VALVE_PIN D8

// Analog Reader -----------------------------------------------
#define ADS1015_I2C_ADDRESS 0x48

// HTTPServer -----------------------------------------------
#define HTTP_SERVER_PORT 80
#define HTTP_SERVER_ADDRESS "192.168.10.1"
#define HTTP_SERVER_GATEWAY "192.168.10.1"
#define HTTP_SERVER_SUBNET_MASK "255.255.255.0"

// AccessPoint -----------------------------------------------
#define ACCESS_POINT_SSID "LaunchPad"
#define ACCESS_POINT_PASSWD "123456789"


// Config struct for the eeprom
typedef struct {
  // Pressure
  float pressureFactor;
  float pressureOffset;
  // Voltage
  float voltageFactor;
  float voltageOffset;
  // Valve
  int16_t openTimeout;
  
} Config;

#endif // _CONFIG_H
