#ifndef _CONFIG_MANAGER_H
#define _CONFIG_MANAGER_H

#include <Print.h>
#include <EEPROM.h>
#include <Arduino.h>

#include "config.h"

class ConfigManager
{
public:
  ConfigManager();

  bool setup(Print *print);

  Config *get_config();

  bool write();

private:
  void print_config();
  void default_config();

  int _eeprom_address;

  Print *_print;
  Config _config;
};

#endif // _CONFIG_MANAGER_H
