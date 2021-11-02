#include "flight_observer.h"

FlightObserver::FlightObserver() {

}

bool FlightObserver::setup(Config *config, StatusLeds *status_leds, IMU *imu, AltitudeManager *altitude_manager, DataLogger* data_logger) {
  this->_imu = imu;
  this->_config = config;
  this->_status_leds = status_leds;
  this->_data_logger = data_logger;
  this->_altitude_manager = altitude_manager;

  this->_state = FLIGHT_STATE_INIT;

  return true;
}

void FlightObserver::update() {
  switch (this->_state) {
    case FLIGHT_STATE_INIT:
      this->init();
      break;
    case FLIGHT_STATE_WAIT_FOR_LANUCH:
      this->wait_for_launch();
      break;
    case FLIGHT_STATE_LAUNCHED:
      this->launched();
      break;
    case FLIGHT_STATE_WAIT_FOR_APOGEE:
      this->wait_for_apogee();
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

void FlightObserver::init() {
  this->_state = FLIGHT_STATE_WAIT_FOR_LANUCH;
}

void FlightObserver::wait_for_launch() {
  Vec3f *acceleration = this->_imu->get_acceleration();
  float length = acceleration->length();

  if (length > this->_config->launch_acceleration) {
    this->_state = FLIGHT_STATE_LAUNCHED;
  }
}

void FlightObserver::launched() {
  this->_status_leds->off();

  this->_state = FLIGHT_STATE_WAIT_FOR_APOGEE;
}

void FlightObserver::wait_for_apogee() {


  this->_state = FLIGHT_STATE_APOGEE;
}

void FlightObserver::apogee() {


  this->_state = FLIGHT_STATE_WAIT_FOR_LANDING;
}

void FlightObserver::wait_for_landing() {


  this->_state = FLIGHT_STATE_LANDED;
}

void FlightObserver::landed() {


  this->_state = FLIGHT_STATE_IDLE;
}

void FlightObserver::idle() {

}
