#ifndef _FLIGHT_OBSERVER_H
#define _FLIGHT_OBSERVER_H

#include <Arduino.h>

#include "config.h"
#include "data_logger.h"
#include "status_leds.h"
#include "motion_manager.h"
#include "altitude_manager.h"

class FlightObserver
{
  public:
    FlightObserver();

    bool setup(Config *config, StatusLeds *status_leds, MotionManager *motion_manager, AltitudeManager *altitude_manager, DataLogger* data_logger);
    void update();

  private:

    Config *_config;
    DataLogger *_data_logger;
    StatusLeds *_status_leds;
    MotionManager *_motion_manager;
    AltitudeManager *_altitude_manager;
};

#endif // _FLIGHT_OBSERVER_H
