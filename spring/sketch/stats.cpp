#include "stats.h"

Stats::Stats() {

}

bool Stats::setup() {
  this->_delta = 0.0;
  this->_last = millis();

  return true;
}

float Stats::update() {
  unsigned long now = millis();
  unsigned long elapsed = now - this->_last;
  this->_last = now;

  this->_delta = max(((float)elapsed) / 1000.0, 0.001);
  return this->_delta;
}

float Stats::get_delta() {
  return this->_delta;
}
