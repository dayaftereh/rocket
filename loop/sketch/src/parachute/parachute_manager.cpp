#include "parachute_manager.h"

ParachuteManager::ParachuteManager()
{
}

bool ParachuteManager::setup(Config *config, LEDs *leds)
{
  this->_leds = leds;
  this->_config = config;

  this->_completed = false;

  // check if the servo is configured
  if (this->_config->parachute_servo)
  {
    // attach the servo to pin
    this->_servo.attach(PARACHUTE_MANAGER_PIN, 500, 2400);
    Serial.println("parachute manager is using servo");
  }
  else
  {
    // set the pin as output
    pinMode(PARACHUTE_MANAGER_PIN, OUTPUT);
    Serial.println("parachute manager is using output flag");
  }

  // wait a short time
  this->_leds->delay(100);

  // reset the bools
  this->reset();

  return true;
}

void ParachuteManager::open()
{
  if (this->_config->parachute_servo)
  {
    this->_servo.write(this->_config->parachute_servo_open_angle);
  }
  else
  {
    digitalWrite(PARACHUTE_MANAGER_PIN, HIGH);
  }
}

void ParachuteManager::close()
{
  if (this->_config->parachute_servo)
  {
    this->_servo.write(this->_config->parachute_servo_close_angle);
  }
  else
  {
    digitalWrite(PARACHUTE_MANAGER_PIN, LOW);
  }
}

void ParachuteManager::update()
{
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
  this->close();
  this->_trigger = false;
  this->_timer = millis();
}

void ParachuteManager::trigger()
{
  this->open();
  this->_trigger = true;
  this->_timer = millis();
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
