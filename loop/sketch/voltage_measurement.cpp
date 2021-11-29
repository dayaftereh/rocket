#include "voltage_measurement.h"

VoltageMeasurement::VoltageMeasurement() {
}

bool VoltageMeasurement::setup(Config *config) {
  this->_config = config;
  return true;
}

void VoltageMeasurement::update() {
  float voltage = (float)analogRead(VOLTAGE_MEASUREMENT_PIN);
  this->_voltage = ((voltage / 4094.0) * 3.3) * 2.0;
}

float VoltageMeasurement::get_voltage() {
  return this->_voltage;
}
