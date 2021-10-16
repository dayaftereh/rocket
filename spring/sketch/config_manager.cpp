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
  // output the config
  this->print_config();

  return true;
}

void ConfigManager::print_config() {
  Serial.print("config from eeprom");

  /*
  Serial.print(" [ foo: ");
  Serial.print(this->_config.foo);
  Serial.print(", bar: ");
  Serial.print(this->_config.bar);
  */

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
