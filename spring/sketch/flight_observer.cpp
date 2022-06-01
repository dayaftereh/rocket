#include "flight_observer.h"

FlightObserver::FlightObserver()
{
}

bool FlightObserver::setup(Config *config, StatusLeds *status_leds, IMU *imu, AltitudeManager *altitude_manager, ParachuteManager *parachute_manager, Stats *stats)
{
  this->_imu = imu;
  this->_stats = stats;
  this->_config = config;
  this->_status_leds = status_leds;
  this->_altitude_manager = altitude_manager;
  this->_parachute_manager = parachute_manager;

  this->_state = FLIGHT_STATE_LOCKED;

  this->_landing_timer = 0.0;
  this->_landing_counter = 0;
  this->_maximum_altitude = 0.0;

  this->_launched = false;

  return true;
}

void FlightObserver::update()
{
  switch (this->_state)
  {
  case FLIGHT_STATE_INIT:
    this->init();
    break;
  case FLIGHT_STATE_WAIT_FOR_LANUCH:
    this->wait_for_launch();
    break;
  case FLIGHT_STATE_LAUNCHED:
    this->launched();
    break;
  case FLIGHT_STATE_WAIT_LIFT_OFF:
    this->wait_for_lift_off();
    break;
  case FLIGHT_STATE_LIFT_OFF:
    this->lift_off();
    break;
  case FLIGHT_STATE_WAIT_FOR_APOGEE:
    this->wait_for_apogee();
    break;
  case FLIGHT_STATE_APOGEE:
    this->apogee();
    break;
  case FLIGHT_STATE_WAIT_FOR_LANDING:
    this->wait_for_landing();
    break;
  case FLIGHT_STATE_LANDED:
    this->landed();
    break;
  case FLIGHT_STATE_IDLE:
    this->idle();
    break;
  }
}

void FlightObserver::unlock()
{
  this->_state = FLIGHT_STATE_INIT;
}

void FlightObserver::init()
{
  this->_state = FLIGHT_STATE_WAIT_FOR_LANUCH;
}

void FlightObserver::wait_for_launch()
{

  Vec3f *acceleration_normalize = this->_imu->get_world_acceleration_normalized();

  // check if the z acceleration above launch
  if (acceleration_normalize->z < this->_config->launch_acceleration)
  {
    return;
  }

  Vec3f *acceleration = this->_imu->get_world_acceleration();
  // calculate angle between inverted acceleration and rocket up
  Vec3f rocket_direction = this->compute_rocket_direction();
  float angle = acceleration->invert().angle_to(rocket_direction) * RAD_2_DEG;

  if (abs(angle) > this->_config->launch_angle)
  {
    return;
  }

  Serial.print("acceleration_normalize->z: ");
  Serial.print(acceleration_normalize->z);
  Serial.print(" launch_acceleration: ");
  Serial.print(this->_config->launch_acceleration);
  Serial.print(", angle: ");
  Serial.print(angle);

  Serial.println(" => launch!");

  this->_state = FLIGHT_STATE_LAUNCHED;
}

void FlightObserver::launched()
{
  this->_status_leds->off();

  // set launched to true
  this->_launched = true;
  this->_launch_time = millis();

  this->_velocity.x = 0.0;
  this->_velocity.y = 0.0;
  this->_velocity.z = 0.0;

  this->_last_acceleration.x = 0.0;
  this->_last_acceleration.y = 0.0;
  this->_last_acceleration.z = 0.0;

  this->_state = FLIGHT_STATE_WAIT_LIFT_OFF;
}

void FlightObserver::wait_for_lift_off()
{
  this->update_acceleration_and_velocity();

  // check fir lift of speed
  if (this->_velocity.z < this->_config->lift_off_velocity_threshold)
  {
    return;
  }

  Serial.print("velocity:");
  Serial.print(this->_velocity.z);
  Serial.println(" => lift-off!");

  this->_status_leds->on();
  this->_state = FLIGHT_STATE_LIFT_OFF;
}

void FlightObserver::lift_off()
{
  this->update_acceleration_and_velocity();
  this->_status_leds->off();

  this->_state = FLIGHT_STATE_WAIT_FOR_APOGEE;
}

void FlightObserver::wait_for_apogee()
{
  this->update_acceleration_and_velocity();
  // update the altitude
  float altitude = this->_altitude_manager->get_altitude_delta();
  this->_maximum_altitude = max(this->_maximum_altitude, altitude);

  // check if parachute triggered
  bool next = this->observe_parachute();
  if (!next)
  {
    return;
  }

  this->_status_leds->on();

  Serial.print("maximum_altitude: ");
  Serial.print(this->_maximum_altitude);
  Serial.println(" => apogee!");

  this->_state = FLIGHT_STATE_APOGEE;
}

void FlightObserver::apogee()
{
  this->update_acceleration_and_velocity();
  this->_status_leds->off();

  this->_state = FLIGHT_STATE_WAIT_FOR_LANDING;
}

void FlightObserver::wait_for_landing()
{

  this->update_acceleration_and_velocity();
  // still observe parachute
  this->observe_parachute();

  Vec3f *acceleration = this->_imu->get_world_acceleration_normalized();
  // check if the z acceleration lower landing acceleration
  if (abs(acceleration->z) > this->_config->landing_acceleration)
  {
    return;
  }

  // check if the altitude close to the started one
  float altitude = this->_altitude_manager->get_altitude_delta();
  if (altitude > this->_config->landing_altitude_threshold)
  {
    return;
  }

  // get current rotation
  Vec3f *rotation = this->_imu->get_rotation();
  // cumulate the current rotations
  this->_landing_counter++;
  this->_landing_cumulate_orientation = this->_landing_cumulate_orientation.add(*rotation);

  // update the timer
  float t = this->_stats->get_delta();
  this->_landing_timer += t;

  // check if landing timer reached
  if (this->_landing_timer < this->_config->landing_orientation_timeout)
  {
    return;
  }
  // reset timer
  this->_landing_timer = 0.0;
  // get avarage orientation
  Vec3f orientation = this->_landing_cumulate_orientation.divide_scalar(this->_landing_counter);
  // reset counter and cumulate vector
  this->_landing_counter = 0;
  this->_landing_cumulate_orientation = Vec3f(0.0, 0.0, 0.0);

  // get the delta rotation
  Vec3f delta = orientation.subtract(this->_landing_orientation);
  this->_landing_orientation = orientation;

  float changed = delta.length();
  if (changed > this->_config->landing_orientation_threshold)
  {
    return;
  }

  Serial.println(" => landed!");

  this->_state = FLIGHT_STATE_LANDED;
}

void FlightObserver::landed()
{
  // turn the led back on
  this->_status_leds->on();

  // set launched back to false
  this->_launched = false;

  this->_state = FLIGHT_STATE_IDLE;
}

void FlightObserver::idle()
{
}

// *****************

Vec3f FlightObserver::compute_rocket_direction()
{
  Vec3f up(0.0, 0.0, 1.0);
  Quaternion *orientation = this->_imu->get_orientation();
  Vec3f rocket_up = orientation->multiply_vec(up);
  return rocket_up;
}

bool FlightObserver::observe_parachute()
{
  bool triggered = false;

  float altitude = this->_altitude_manager->get_altitude_delta();
  float altitude_delta = this->_maximum_altitude - altitude;

  // check if max altitude reached
  if (altitude_delta > this->_config->apogee_altitude_threshold)
  {
    triggered = true;
    this->_parachute_manager->altitude_trigger();
  }

  // calculate the angle between world up and rocket direction
  Vec3f up(0.0, 0.0, 1.0);
  Vec3f rocket_up = this->compute_rocket_direction();
  float angle = up.angle_to(rocket_up) * RAD_2_DEG;

  if (abs(angle) > this->_config->apogee_orientation_threshold)
  {
    triggered = true;
    this->_parachute_manager->orientation_trigger();
  }

  // check if velocity close to zero
  if (this->_velocity.z < this->_config->apogee_velocity_threshold)
  {
    triggered = true;
    this->_parachute_manager->velocity_trigger();
  }

  /*Serial.print("altitude_delta: ");
    Serial.print(altitude_delta);
    Serial.print(" angle: ");
    Serial.print(angle);
    Serial.print(" velocity: ");
    Serial.print(this->_velocity.z);
    Serial.print(" triggered: ");
    Serial.print(triggered);
    Serial.println("");*/

  return triggered;
}

void FlightObserver::update_acceleration_and_velocity()
{
  float dt = this->_stats->get_delta();
  // get the filtered acceleration
  Vec3f *acceleration = this->_imu->get_world_acceleration();
  // get the delta acceleration
  Vec3f delta_acceleration = acceleration->subtract(this->_last_acceleration);
  // store the last acceleration
  this->_last_acceleration = acceleration->clone();
  // get the delta velocity
  Vec3f delta_velocity = delta_acceleration.divide_scalar(dt);
  // add the delta velocity to current velocity
  this->_velocity = this->_velocity.add(delta_velocity);
}

void FlightObserver::update_flight_termination()
{
  if (!this->_launched)
  {
    return;
  }

  // check if the flight over timed
  unsigned long delta = this->_launch_time - millis();
  if (delta < FLIGHT_OBSERVER_TERMINATION_TIMEOUT)
  {
    return;
  }
  // open the parachute
  this->_parachute_manager->trigger();
  // set to landed state
  this->_state = FLIGHT_STATE_LANDED;

  Serial.println(" => flight terminated");
}

Vec3f *FlightObserver::get_velocity()
{
  return &this->_velocity;
}

float FlightObserver::get_maximum_altitude()
{
  return this->_maximum_altitude;
}

FlightState FlightObserver::get_state()
{
  return this->_state;
}

bool FlightObserver::is_launched()
{
  return this->_launched;
}

bool FlightObserver::is_locked()
{
  return this->_state == FLIGHT_STATE_LOCKED;
}
