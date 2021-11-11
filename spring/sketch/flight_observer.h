#ifndef _FLIGHT_OBSERVER_H
#define _FLIGHT_OBSERVER_H

#include <Arduino.h>

#include "imu.h"
#include "stats.h"
#include "config.h"
#include "data_logger.h"
#include "status_leds.h"
#include "altitude_manager.h"
#include "parachute_manager.h"

enum FlightState
{
  FLIGHT_STATE_INIT,
  FLIGHT_STATE_WAIT_FOR_LANUCH,
  FLIGHT_STATE_LAUNCHED,
  FLIGHT_STATE_WAIT_FOR_APOGEE,
  FLIGHT_STATE_APOGEE,
  FLIGHT_STATE_WAIT_FOR_LANDING,
  FLIGHT_STATE_LANDED,
  FLIGHT_STATE_IDLE,
};

class FlightObserver
{
public:
  FlightObserver();

  bool setup(Config *config, StatusLeds *status_leds, IMU *imu, AltitudeManager *altitude_manager, DataLogger *data_logger, ParachuteManager *parachute_manager, Stats *stats);
  void update();

private:
  void wait_for_apogee();
  void wait_for_launch();
  void wait_for_landing();

  void idle();
  void init();
  void apogee();
  void landed();
  void launched();

  Vec3f compute_rocket_direction();

  void update_velocity();
  bool observe_parachute();
  
  float _maximum_altitude;

  float _landing_timer;
  int _landing_counter;

  Vec3f _velocity;
  Vec3f _landing_orientation;
  Vec3f _landing_cumulate_orientation;

  FlightState _state;

  IMU *_imu;
  Stats *_stats;
  Config *_config;
  DataLogger *_data_logger;
  StatusLeds *_status_leds;
  AltitudeManager *_altitude_manager;
  ParachuteManager *_parachute_manager;
};

#endif // _FLIGHT_OBSERVER_H
