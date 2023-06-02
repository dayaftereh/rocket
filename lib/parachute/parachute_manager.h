#ifndef _PARACHUTE_MANAGER_H
#define _PARACHUTE_MANAGER_H

#include <Arduino.h>

#include "parachute_manager_config.h"

class ParachuteManager
{
public:
    ParachuteManager();

    bool setup(ParachuteManagerConfig *config, Print *print);
  
    void open();
    void close();

private:
    Print *_print;
    ParachuteManagerConfig *_config;
};

#endif // _PARACHUTE_MANAGER_H
