#include "config_manager.h"

ConfigManager::ConfigManager()
{
  this->_eepromAddress = 0;
}

bool ConfigManager::setup()
{
  // start the eerom
  EEPROM.begin(EEPROM_CONFIG_SIZE);
  // loading the config from the eeprom
  EEPROM.get(this->_eepromAddress, this->_config);

  // end the eeprom read
  bool success = EEPROM.end();
  if (!success)
  {
    Serial.println("fail to end eeprom read");
    return false;
  }

  success = this->write_default();
  if (!success)
  {
    return false;
  }

  // output the config
  this->print_config();

  return true;
}

void ConfigManager::print_config()
{
  Serial.print("config from eeprom");

  Serial.print(" [ parachute_timeout: ");
  Serial.print(this->_config.parachute_timeout);

  Serial.print(", complimentary_filter: ");
  Serial.print(this->_config.complimentary_filter);

  Serial.print(", magnetometer_offset_x: ");
  Serial.print(this->_config.magnetometer_offset_x);

  Serial.print(", magnetometer_offset_y: ");
  Serial.print(this->_config.magnetometer_offset_y);

  Serial.print(", magnetometer_offset_z: ");
  Serial.print(this->_config.magnetometer_offset_z);

  Serial.println(" ]");
}

Config *ConfigManager::get_config()
{
  return &this->_config;
}

bool ConfigManager::write()
{
  // output the config
  this->print_config();
  // start the eeprom write
  EEPROM.begin(EEPROM_CONFIG_SIZE);
  // write the config to eeprom
  EEPROM.put(this->_eepromAddress, this->_config);
  // commit and persists the eeprom
  bool success = EEPROM.end();
  if (!success)
  {
    return false;
  }

  Serial.println("config written to eeprom");

  return true;
}

bool ConfigManager::write_default()
{
  this->_config.parachute_timeout = 1000;
  this->_config.complimentary_filter = 0.93;

  this->_config.magnetometer_offset_x = 0;//;(603.0 + (-578.0)) / 2.0;
  this->_config.magnetometer_offset_y = 0;//(542.0 + (-701.0)) / 2.0;
  this->_config.magnetometer_offset_z = 0;//(547.0 + (-556.0)) / 2.0;

  bool success = this->write();
  if (!success)
  {
    Serial.println("fail to write default config to eeprom");
    return false;
  }

  return true;
}
