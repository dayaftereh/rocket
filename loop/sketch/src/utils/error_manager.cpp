#include "error_manager.h"

ErrorManager::ErrorManager()
{
}

void ErrorManager::setup(LEDs *leds)
{
  this->_leds = leds;
}

void ErrorManager::error(ErrorCode error)
{

  this->_leds->red_off();
  this->_leds->green_off();

  while (true)
  {
    this->flash_error(abs(error));
    delay(1000);
  }
}

void ErrorManager::flash_error(int count)
{
  // flash the error code
  this->_leds->red_flash(count, 500);

  delay(750);

  // flash the reset
  this->flash_reset();
}

void ErrorManager::flash_reset()
{
  this->_leds->red_flash(3, 150);
}
