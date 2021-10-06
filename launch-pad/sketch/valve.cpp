#include "valve.h"

Valve::Valve() {
  this->_flag = LOW;
}

bool Valve::setup(Config *config) {
  this->_config = config;

  pinMode(VALVE_PIN, OUTPUT);

  return true;
}

void Valve::open() {
  this->_flag = HIGH;
  this->_timer = millis();
}

void Valve::close() {
  this->_flag = LOW;
}

bool Valve::is() {
  return this->_flag == HIGH;
}

void Valve::update() {
  // calculate open timeout delta
  int16_t delta = millis() - this->_timer;
  // check if open timeout reached
  if (delta > this->_config->openTimeout) {
    // close
    this->_flag = LOW;
  }

  digitalWrite(VALVE_PIN, this->_flag);
}
