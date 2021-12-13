#ifndef _LEDS_H
#define _LEDS_H

#include <Arduino.h>

#include "../config/config.h"

class LEDs
{
public:
  LEDs();

  void setup();

  void update();

  void sleep(int timeout);

  void red_flash(int count, int timeout);
  void green_flash(int count, int timeout);

  void red_on();
  void red_off();
  void red_toggle();
  void red_no_blink();
  void red_blink(int timeout);

  void green_on();
  void green_off();
  void green_toggle();
  void green_no_blink();
  void green_blink(int timeout);

private:
  void flash(int pin, int count, int timeout);
  
  void update_red(uint32_t now);
  void update_green(uint32_t now);

  bool _red_led;
  bool _green_led;

  bool _red_blink;
  bool _green_blink;

  int _red_timeout;
  int _green_timeout;

  uint32_t _red_timer;
  uint32_t _green_timer;
};

#endif // _LEDS_H
