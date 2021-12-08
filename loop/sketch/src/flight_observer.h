#ifndef _FLIGHT_OBSERVER_H
#define _FLIGHT_OBSERVER_H

#include <Arduino.h>

#include "tvc/tvc.h"
#include "imu/imu.h"
#include "utils/leds.h"
#include "utils/stats.h"
#include "config/config.h"
#include "altitude/altitude_manager.h"
#include "parachute/parachute_manager.h"

enum FlightState
{
  FLIGHT_STATE_LOCKED,
  FLIGHT_STATE_INIT,
  FLIGHT_STATE_WAIT_FOR_LANUCH,
  FLIGHT_STATE_LAUNCHED,
  FLIGHT_STATE_WAIT_LIFT_OFF,
  FLIGHT_STATE_LIFT_OFF,
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

  bool setup(Config *config, LEDs *leds, IMU *imu, TVC *tvc, AltitudeManager *altitude_manager, ParachuteManager *parachute_manager, Stats *stats);
  void update();

  void unlock();

  bool is_locked();
  bool is_launched();

  Vec3f *get_velocity();
  FlightState get_state();
  float get_maximum_altitude();

private:
  void wait_for_apogee();
  void wait_for_launch();
  void wait_for_landing();
  void wait_for_lift_off();

  void idle();
  void init();
  void apogee();
  void landed();
  void lift_off();
  void launched();

  Vec3f compute_rocket_direction();

  void update_velocity();
  bool observe_parachute();

  void update_flight_termination();

  bool _launched;
  unsigned long _launch_time;

  float _maximum_altitude;

  float _landing_timer;
  int _landing_counter;

  Vec3f _velocity;
  Vec3f _landing_orientation;
  Vec3f _landing_cumulate_orientation;

  FlightState _state;

  IMU *_imu;
  TVC *_tvc;
  LEDs *_leds;
  Stats *_stats;
  Config *_config;
  AltitudeManager *_altitude_manager;
  ParachuteManager *_parachute_manager;
};

#endif // _FLIGHT_OBSERVER_H
