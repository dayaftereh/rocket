#include "config_manager.h"

ConfigManager::ConfigManager() {
  this->_eepromAddress = 0;
}

bool ConfigManager::setup() {
  // start the eerom
  EEPROM.begin(EEPROM_CONFIG_SIZE);
  // loading the config from the eeprom
  EEPROM.get(this->_eepromAddress , this->_config);

  // end the eeprom read
  bool success = EEPROM.end();
  if (!success) {
    Serial.println("fail to end eeprom read");
    return false;
  }

  success = this->write_default();
  if (!success) {
    return false;
  }

  // output the config
  this->print_config();

  return true;
}

void ConfigManager::print_config() {
  Serial.print("config from eeprom");

  // offset for mpu6050 acceleration
  Serial.print(" [ acceleration_x_offset: ");
  Serial.print(this->_config.acceleration_x_offset);
  Serial.print(", acceleration_y_offset: ");
  Serial.print(this->_config.acceleration_y_offset);
  Serial.print(", acceleration_z_offset: ");
  Serial.print(this->_config.acceleration_z_offset);

  // offset for mpu6050 gyroscope
  Serial.print(", gyroscope_x_offset: ");
  Serial.print(this->_config.gyroscope_x_offset);
  Serial.print(", gyroscope_y_offset: ");
  Serial.print(this->_config.gyroscope_y_offset);
  Serial.print(", gyroscope_z_offset: ");
  Serial.print(this->_config.gyroscope_z_offset);

  // mpu6050 motion
  Serial.print(", motion_detection_threshold: ");
  Serial.print(this->_config.motion_detection_threshold);

  Serial.println(" ]");
}

Config* ConfigManager::get_config() {
  return &this->_config;
}

bool ConfigManager::write() {
  // output the config
  this->print_config();
  // start the eeprom write
  EEPROM.begin(EEPROM_CONFIG_SIZE);
  // write the config to eeprom
  EEPROM.put(this->_eepromAddress , this->_config);
  // commit and persists the eeprom
  bool success = EEPROM.end();
  if (!success) {
    return false;
  }

  Serial.println("config written to eeprom");

  return true;
}

bool ConfigManager::write_default() {
  // offset for mpu6050 acceleration
  this->_config.acceleration_x_offset = -0.5;
  this->_config.acceleration_y_offset = 0.5;
  this->_config.acceleration_z_offset = -0.5;

  // offset for mpu6050 gyroscope
  this->_config.gyroscope_x_offset = -48.5;
  this->_config.gyroscope_y_offset = -1.0;
  this->_config.gyroscope_z_offset = 1.0;

  // mpu6050 motion
  this->_config.motion_detection_threshold = 1.0;

  this->_config.parachute_timeout = 1000;

  bool success = this->write();
  if (!success) {
    Serial.println("fail to write default config to eeprom");
    return false;
  }

  return true;
}
