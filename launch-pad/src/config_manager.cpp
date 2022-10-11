#include "config_manager.h"

ConfigManager::ConfigManager()
{
  this->_eeprom_address = 0;
}

bool ConfigManager::setup(Print *print)
{
  this->_print = print;

  // start the eerom
  bool success = EEPROM.begin(EEPROM_CONFIG_SIZE);
  if (!success)
  {
    this->_print->println("fail to begin eeprom for read");
    return false;
  }

  // loading the config from the eeprom
  this->_config = EEPROM.get(this->_eeprom_address, this->_config);

  // end the eeprom read
  EEPROM.end();

  // write the default config
  this->default_config();
  success = this->write();
  if (!success)
  {
    this->_print->println("fail to write default config to eeprom");
    return false;
  }

  // output the config
  this->print_config();

  return true;
}

void ConfigManager::print_config()
{
  this->_print->print("config from eeprom");

  this->_print->print(" [ ssid: ");
  this->_print->print(this->_config.ssid);
  this->_print->print(", passwd: ");
  this->_print->print(this->_config.password);
  this->_print->print(", captive_portal: ");
  this->_print->print(this->_config.captive_portal);

  this->_print->println(" ]");
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
  bool success = EEPROM.begin(EEPROM_CONFIG_SIZE);
  if (!success)
  {
    this->_print->println("fail to begin eeprom for write");
    return false;
  }
  // write the config to eeprom
  EEPROM.put(this->_eeprom_address, this->_config);
  // commit and persists the eeprom
  EEPROM.end();

  this->_print->println("config written to eeprom");

  return true;
}

void ConfigManager::default_config()
{
  // enable the captive portal
  this->_config.captive_portal = true;

  // set the default ssid
  char *ssid = this->_config.ssid;
  ssid = (char *)"Launch-Pad";

  // set the default password
  char *password = this->_config.password;
  password = (char *)"123456789";
}