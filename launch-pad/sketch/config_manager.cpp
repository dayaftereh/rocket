#include "config_manager.h"

ConfigManager::ConfigManager() {
  this->_eepromAddress = 0;
}

bool ConfigManager::setup() {
  // loading the config from the eeprom
  EEPROM.get(this->_eepromAddress , this->_config);
  // output the config
  this->print_config();

  return true;
}

void ConfigManager::print_config() {
  Serial.print("config from eeprom");

  // Pressure
  Serial.print(" [ pressureFactor: ");
  Serial.print(this->_config.pressureFactor);
  Serial.print(", pressureOffset: ");
  Serial.print(this->_config.pressureOffset);

  Serial.println(" ]");
}

Config* ConfigManager::get_config() {
  return &this->_config;
}

void ConfigManager::write() {
  // output the config
  this->print_config();
  // write the config to eeprom
  EEPROM.put(this->_eepromAddress , this->_config);

  Serial.println("config written to eeprom");
}
