#include "status_leds.h"

StatusLeds::StatusLeds() {

}

void StatusLeds::setup() {
  // set the pin mode
  pinMode(STATUS_LED_1_PIN, OUTPUT);

  this->off();

  delay(100);

  this->_timer = millis();
}

void StatusLeds::on() {
  this->_led1 = true;
  pinMode(STATUS_LED_1_PIN, OUTPUT);
  digitalWrite(STATUS_LED_1_PIN, HIGH);
}

void StatusLeds::off() {
  this->_led1 = false;
  pinMode(STATUS_LED_1_PIN, OUTPUT);
  digitalWrite(STATUS_LED_1_PIN, LOW);
}

void StatusLeds::toggle() {
  if (this->_led1) {
    this->off();
  } else {
    this->on();
  }
}

void StatusLeds::ready() {
  this->on();
  this->_ready = true;
}

void StatusLeds::progress() {
  if (this->_ready) {
    return;
  }

  unsigned long now = millis();
  unsigned long elapsed = now - this->_timer;
  // check if timer reached
  if (elapsed < STATUS_INIT_LED_TIMEOUT) {
    return;
  }
  // switch the led state
  this->toggle();
  // update the timer
  this->_timer = now;
}

void StatusLeds::flash(int count, int timeout) {
  // flash the the given cout with the timeout
  for (int i = 0; i < count; i++) {
    this->off();
    delay(timeout);
    this->on();
    delay(timeout);
  }

  this->off();
}
