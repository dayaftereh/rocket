#ifndef _ERROR_MANAGER_H
#define _ERROR_MANAGER_H

#include "leds.h"
#include "../config/config.h"

enum ErrorCode
{
  ERROR_CONFIG_MANAGER = 1,
  ERROR_DATA_LOGGER,
  ERROR_IMU,
  ERROR_ALTITUDE_MANAGER,
  ERROR_VOLTAGE_MEASUREMENT,
  ERROR_STATS,
  ERROR_FLIGHT_OBSERVER,
  ERROR_REMOTE_SERVER,
  ERROR_PARACHUTE_MANAGER,
  ERROR_NETWORKING,
};

class ErrorManager
{
public:
  ErrorManager();

  void setup(LEDs *_leds);

  void error(ErrorCode error);

private:
  void flash_reset();
  void flash_error(int count);

  LEDs *_leds;
};

#endif // _ERROR_MANAGER_H
