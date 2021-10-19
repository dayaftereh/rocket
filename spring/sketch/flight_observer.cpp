#include "flight_observer.h"

FlightObserver::FlightObserver() {

}

bool FlightObserver::setup(Config *config, StatusLeds *status_leds, MotionManager *motion_manager, AltitudeManager *altitude_manager, DataLogger* data_logger) {
  this->_config = config;
  this->_status_leds = status_leds;
  this->_data_logger = data_logger;
  this->_motion_manager = motion_manager;
  this->_altitude_manager = altitude_manager;

  return true;
}

void FlightObserver::update() {

}
