#include "analog_reader.h"

AnalogReader::AnalogReader() {

}

bool AnalogReader::setup(Config *config) {
  this->_config = config;

  // setup the ads1015
  this->_ads = new ADS1015(ADS1015_I2C_ADDRESS);
  this->_ads->begin();
  this->_ads->setGain(0);

  return true;
}

void AnalogReader::update() {
  // read the pressure
  int16_t rawPressure = this->_ads->readADC(0);
  float pressureVoltage = this->_ads->toVoltage(rawPressure);
  this->_pressure = pressureVoltage * this->_config->pressureFactor + this->_config->pressureOffset;

  // read the voltage
  int16_t rawVoltage = this->_ads->readADC(1);
  float halfVoltage = this->_ads->toVoltage(rawVoltage);
  this->_voltage = halfVoltage * this->_config->voltageFactor + this->_config->voltageOffset;
}

float AnalogReader::get_voltage() {
  return this->_voltage;
}

float AnalogReader::get_pressure() {
  return this->_pressure;
}
