#include "leds.h"

LEDs::LEDs()
{
}

void LEDs::setup()
{
  // set the pin mode
  pinMode(STATUS_LED_RED_PIN, OUTPUT);
  pinMode(STATUS_LED_GREEN_PIN, OUTPUT);

  // set all leds off
  this->red_on();
  this->green_on();
}

void LEDs::red_on()
{
  this->_red_led = true;
}

void LEDs::red_off()
{
  this->_red_led = false;
}

void LEDs::red_toggle()
{
  this->_red_led = !this->_red_led;
}

void LEDs::red_no_blink()
{
  this->_red_blink = false;
}

void LEDs::red_blink(int timeout)
{
  this->_red_blink = true;
  this->_red_timer = millis();
  this->_red_timeout = timeout;
}

void LEDs::green_on()
{
  this->_green_led = true;
}

void LEDs::green_off()
{
  this->_green_led = false;
}

void LEDs::green_toggle()
{
  this->_green_led = !this->_green_led;
}

void LEDs::green_no_blink()
{
  this->_green_blink = false;
}

void LEDs::green_blink(int timeout)
{
  this->_green_blink = true;
  this->_green_timer = millis();
  this->_green_timeout = timeout;
}

void LEDs::update_red(uint32_t now)
{
  digitalWrite(STATUS_LED_RED_PIN, this->_red_led);
  if (!this->_red_blink)
  {
    return;
  }

  uint32_t delta = now - this->_red_timer;
  if (delta < this->_red_timeout)
  {
    return;
  }

  this->_red_timer = now;
  this->red_toggle();
}

void LEDs::update_green(uint32_t now)
{
  digitalWrite(STATUS_LED_GREEN_PIN, this->_green_led);
  if (!this->_green_blink)
  {
    return;
  }

  uint32_t delta = now - this->_green_timer;
  if (delta < this->_green_timeout)
  {
    return;
  }

  this->_green_timer = now;
  this->green_toggle();
}

void LEDs::update()
{
  uint32_t now = millis();

  // update the red led
  this->update_red(now);

  // update the green led
  this->update_green(now);
}

void LEDs::red_flash(int count, int timeout)
{
  this->flash(STATUS_LED_RED_PIN, count, timeout);
}

void LEDs::green_flash(int count, int timeout)
{
  this->flash(STATUS_LED_GREEN_PIN, count, timeout);
}

void LEDs::flash(int pin, int count, int timeout)
{
  digitalWrite(pin, LOW);

  for (int i = 0; i < count; i++)
  {
    delay(timeout);
    digitalWrite(pin, HIGH);

    delay(timeout);
    digitalWrite(pin, LOW);
  }
}

void LEDs::delay(int timeout)
{
  int64_t start = millis();
  int64_t left = timeout;

  while (left > 0)
  {

    // update the led status
    this->update();

    // delay for a short time
    int delay_time = min(left, (int64_t)10);
    delay(delay_time);

    // update left
    left = timeout - (((int64_t)millis()) - start);
  }
}