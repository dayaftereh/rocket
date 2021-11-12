#include "parachute_manager.h"

ParachuteManager::ParachuteManager()
{
}

bool ParachuteManager::setup(Config *config, StatusLeds *status_leds)
{
  // set the config
  this->_config = config;
  this->_status_leds = status_leds;

  this->_completed = false;

  // check if the servo is configured
  if (this->_config->parachute_servo)
  {
    // attach the servo to pin
    this->_servo.attach(PARACHUTE_MANAGER_PIN);
    Serial.println("parachute manager is using servo");
  }
  else
  {
    // set the pin as output
    pinMode(PARACHUTE_MANAGER_PIN, OUTPUT);
    Serial.println("parachute manager is using output flag");
  }

  this->_status_leds->progress();

  // wait for servo setup
  delay(100);

  this->_status_leds->progress();

  // reset the bools
  this->reset();

  return true;
}

void ParachuteManager::update()
{
  if (!this->_config->parachute_servo)
  {
    // write the digital output
    digitalWrite(PARACHUTE_MANAGER_PIN, this->_trigger);
  }

  // check if a trigger running
  if (!this->_trigger)
  {
    return;
  }

  // calculate timer elapsed
  unsigned long elapsed = millis() - this->_timer;
  // check if time reached
  if (elapsed < this->_config->parachute_timeout)
  {
    return;
  }

  this->reset();
}

void ParachuteManager::reset()
{
  this->_trigger = false;
  this->_timer = millis();
  // move the servo back
  if (this->_config->parachute_servo)
  {
    this->_servo.write(this->_config->parachute_servo_close_angle);
  }
}

void ParachuteManager::trigger()
{
  this->_trigger = true;
  this->_timer = millis();

  // open the servo
  if (this->_config->parachute_servo)
  {
    this->_servo.write(this->_config->parachute_servo_open_angle);
  }
}

void ParachuteManager::altitude_trigger()
{
  this->_altitude = true;
  if (!this->_completed)
  {
    this->trigger();
    this->_completed = true;
  }
}

void ParachuteManager::orientation_trigger()
{
  this->_orientation = true;
  if (!this->_completed)
  {
    this->trigger();
    this->_completed = true;
  }
}

void ParachuteManager::velocity_trigger()
{
  this->_velocity = true;
  if (!this->_completed)
  {
    this->trigger();
    this->_completed = true;
  }
}

bool ParachuteManager::is_velocity_triggered()
{
  return this->_velocity;
}

bool ParachuteManager::is_altitude_triggered()
{
  return this->_altitude;
}

bool ParachuteManager::is_orientation_triggered()
{
  return this->_orientation;
}
