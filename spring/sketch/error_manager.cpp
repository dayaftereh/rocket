#include "error_manager.h"

ErrorManager::ErrorManager() {

}

void ErrorManager::setup(StatusLeds *status_leds) {
  this->_status_leds = status_leds;
}

void ErrorManager::error(ErrorCode error) {
  while (true) {
    this->flash_error(abs(error));
    delay(1000);
  }
}

void ErrorManager::flash_error(int count) {
  // flash the error code
  this->_status_leds->flash(count, 500);
  // flash the reset
  this->flash_reset();
}

void ErrorManager::flash_reset() {
  this->_status_leds->flash(3, 250);
}
