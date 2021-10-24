#ifndef _ERROR_MANAGER_H
#define _ERROR_MANAGER_H

#include "config.h"
#include "status_leds.h"

enum ErrorCode {
  ERROR_CONFIG_MANAGER = 1,
  ERROR_DATA_LOGGER,
  ERROR_MOTION_MANAGER,
  ERROR_ALTITUDE_MANAGER,
  ERROR_VOLTAGE_MEASUREMENT,
  ERROR_STATS,
  ERROR_FLIGHT_OBSERVER,
  ERROR_REMOTE_SERVER,
  ERROR_PARACHUTE_MANAGER,
};

class ErrorManager
{
  public:
    ErrorManager();

    void setup(StatusLeds *status_leds);

    void error(ErrorCode error);

  private:

    void flash_reset();
    void flash_error(int count);

    StatusLeds *_status_leds;
};

#endif // _ERROR_MANAGER_H
