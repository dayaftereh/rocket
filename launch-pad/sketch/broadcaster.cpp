#include "broadcaster.h"

Broadcaster::Broadcaster() {

}

bool Broadcaster::setup(HTTPServer *server, Valve *valve, AnalogReader *analog_reader) {
  this->_valve = valve;
  this->_server = server;
  this->_analog_reader = analog_reader;

  this->reset(millis());

  return true;
}

void Broadcaster::update_analog() {
  this->_counter++;
  // sum up the voltage
  float voltage = this->_analog_reader->get_voltage();
  this->_sum_voltage += voltage;
  // sum up the pressure
  float pressure = this->_analog_reader->get_pressure();
  this->_sum_pressure += pressure;
}

void  Broadcaster::broadcast() {
  // check if valve open
  bool valve = this->_valve->is();
  // calculate voltage and pressure
  float voltage =  this->_sum_voltage / ((float)this->_counter);
  float pressure =  this->_sum_pressure / ((float)this->_counter);

  // create the json document
  DynamicJsonDocument responseDoc(1024);

  responseDoc["valve"] = valve;
  responseDoc["voltage"] = voltage;
  responseDoc["pressure"] = pressure;

  // serialize the response
  String output;
  serializeJson(responseDoc, output);
  // send the output
  bool success = this->_server->broadcast(output);
  if (!success) {
    Serial.println("fail to broadcast update message");
  }
}

void Broadcaster::reset(int16_t now) {
  this->_counter = 0;
  this->_timer = now;

  this->_sum_voltage = 0.0;
  this->_sum_pressure = 0.0;
}

void Broadcaster::update() {
  // update the analog values
  this->update_analog();

  // check if timer exeeded
  int16_t now = millis();
  int16_t delta = now - this->_timer;

  if (delta < BORADCASTER_UPDATE_TIME) {
    return;
  }
  // broadcast the update
  this->broadcast();
  // reset timer and counters
  this->reset(now);
}
