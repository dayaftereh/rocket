#ifndef _FLIGHT_OBSERVER_H
#define _FLIGHT_OBSERVER_H

#include <Arduino.h>

#include "imu.h"
#include "stats.h"
#include "config.h"
#include "status_leds.h"
#include "altitude_manager.h"
#include "parachute_manager.h"

enum FlightState
{
  FLIGHT_STATE_LOCKED,
  FLIGHT_STATE_INIT,
  FLIGHT_STATE_AVERAGE_ACCELERATION,
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

  bool setup(Config *config, StatusLeds *status_leds, IMU *imu, AltitudeManager *altitude_manager, ParachuteManager *parachute_manager, Stats *stats);
  void update();

  void unlock();
  void terminate();

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

  void averageAcceleration();

  Vec3f compute_rocket_direction();

  bool observe_parachute();
  void update_acceleration_and_velocity();

  void update_flight_termination();

  bool _launched;
  unsigned long _launch_time;

  float _maximum_altitude;

  float _landing_timer;
  int _landing_counter;
  int _acceleration_counter;

  Vec3f _velocity;
  Vec3f _last_acceleration;
  Vec3f _acceleration_buffer;
  Vec3f _landing_orientation;
  Vec3f _landing_cumulate_orientation;

  FlightState _state;

  IMU *_imu;
  Stats *_stats;
  Config *_config;
  StatusLeds *_status_leds;
  AltitudeManager *_altitude_manager;
  ParachuteManager *_parachute_manager;
};

#endif // _FLIGHT_OBSERVER_H
