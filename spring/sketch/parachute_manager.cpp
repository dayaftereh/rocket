#include "parachute_manager.h"

ParachuteManager::ParachuteManager() {
}

bool ParachuteManager::setup(Config *config)
{
  // set the config
  this->_config = config;
  // set the pin as output
  pinMode(PARACHUTE_MANAGER_PIN, OUTPUT);

  // reset the bools
  this->reset();

  return true;
}

void ParachuteManager::update() {
  // write the digital output
  digitalWrite(PARACHUTE_MANAGER_PIN, this->_trigger);
  // check if a trigger running
  if (!this->_trigger) {
    return;
  }

  // calculate timer elapsed
  unsigned long elapsed = millis() - this->_timer;
  // check if time reached
  if (elapsed < this->_config->parachute_timeout) {
    return;
  }

  this->reset();
}

void ParachuteManager::reset() {
  this->_trigger = false;
  this->_altitude = false;
  this->_timer = millis();
  this->_orientation = false;
}

void ParachuteManager::trigger() {
  this->_trigger = true;
  this->_timer = millis();
}

void ParachuteManager::altitude_trigger() {
  this->trigger();
  this->_altitude = true;
}

void ParachuteManager::orientation_trigger() {
  this->trigger();
  this->_orientation = true;
}

bool ParachuteManager::is_altitude_triggered() {
  return this->_altitude;
}

bool ParachuteManager::is_orientation_triggered() {
  return this->_orientation;

}
