#include "stats.h"

Stats::Stats() {

}

bool Stats::setup() {
  this->_delta = 0.0;
  this->_last = micros();

  this->_fps = 0.0;
  this->_counter = 0;
  this->_sum_delta = 0.0;

  return true;
}

float Stats::update() {
  this->_counter++;

  unsigned long now = micros();
  unsigned long elapsed = now - this->_last;
  this->_last = now;

  float f = 0.000001;

  this->_delta = max(((float)elapsed) * f, f);
  this->_sum_delta += this->_delta;

  // update and compute the fps
  if (this->_sum_delta > 1.0) {
    this->_fps = this->_sum_delta / ((float)this->_counter);
    this->_counter = 0;
    this->_sum_delta = 0.0;
  }

  return this->_delta;
}

float Stats::get_fps() {
  return this->_fps;
}

float Stats::get_delta() {
  return this->_delta;
}
