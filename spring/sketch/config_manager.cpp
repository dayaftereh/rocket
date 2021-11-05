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

  // output the config
  this->print_config();

  return true;
}

void ConfigManager::print_config()
{
  Serial.print("config from eeprom");

  Serial.print(" [ parachute_timeout: ");
  Serial.print(this->_config.parachute_timeout);

  Serial.print(", madgwick_kp: ");
  Serial.print(this->_config.madgwick_kp);

  Serial.print(", madgwick_ki: ");
  Serial.print(this->_config.madgwick_ki);

  Serial.print(", rotation_x: ");
  Serial.print(this->_config.rotation_x);

  Serial.print(", rotation_y: ");
  Serial.print(this->_config.rotation_y);

  Serial.print(", rotation_z: ");
  Serial.print(this->_config.rotation_z);

  Serial.print(", launch_acceleration: ");
  Serial.print(this->_config.launch_acceleration);

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