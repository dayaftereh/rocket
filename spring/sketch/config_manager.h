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

    bool write();

  private:

    void print_config();
    bool write_default();

    int _eepromAddress;

    Config _config;
};

#endif // _CONFIG_MANAGER_H
