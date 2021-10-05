#ifndef _CONFIG_MANAGER_H
#define _CONFIG_MANAGER_H

#include <Arduino.h>
#include <EEPROM.h>

#include "config.h"

class ConfigManager
{
  public:
    ConfigManager();

    bool setup();

    Config* get_config();

    void write();

  private:

    void print_config();

    int _eepromAddress;

    Config _config;
};

#endif // _CONFIG_MANAGER_H
