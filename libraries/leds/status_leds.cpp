#include "status_leds.h"

StatusLeds::StatusLeds()
{
}

void StatusLeds::setup(StatusLedsConfig *config, Print *print)
{
    this->_print = print;
    this->_config = config;

    if (this->_config->red_pin >= 0)
    {
        pinMode(this->_config->red_pin, OUTPUT);
    }

    if (this->_config->green_pin >= 0)
    {
        pinMode(this->_config->green_pin, OUTPUT);
    }

    this->off_red();
    this->off_green();
}

void StatusLeds::on_red()
{
    this->_red_led = true;
}

void StatusLeds::off_red()
{
    this->_red_led = false;
}

void StatusLeds::on_green()
{
    this->_green_led = true;
}

void StatusLeds::off_green()
{
    this->_green_led = false;
}

void StatusLeds::toggle_red()
{
    this->_red_out = !this->_red_out;
}

void StatusLeds::toggle_green()
{
    this->_green_out = !this->_green_out;
}

void StatusLeds::flash_red(int count, int timeout)
{
    // flash the the given cout with the timeout
    for (int i = 0; i < count; i++)
    {
        this->off_red();
        this->sleep(timeout);
        this->on_red();
        this->sleep(timeout);
    }

    this->off_red();
}

void StatusLeds::flash_green(int count, int timeout)
{
    // flash the the given cout with the timeout
    for (int i = 0; i < count; i++)
    {
        this->off_green();
        this->sleep(timeout);
        this->on_green();
        this->sleep(timeout);
    }

    this->off_green();
}

void StatusLeds::singal_red(int timeout)
{
    this->_signal_red = true;
    this->_timeout_red = timeout;
    this->_timer_red = millis();
}

void StatusLeds::singal_green(int timeout)
{
    this->_signal_green = true;
    this->_timeout_green = timeout;
    this->_timer_green = millis();
}

void StatusLeds::error(int error)
{
    // stop red and green
    this->stop_red();
    this->stop_green();

    // turn of red and green
    this->off_red();
    this->off_green();

    // flush the error code
    int count = abs(error);

    while (true)
    {
        if (this->_config->redirect_error_2_green)
        {
            // flash the error code
            this->flash_green(count, 500);
        }
        else
        {
            // flash the error code
            this->flash_red(count, 500);
        }

        // wait a short time
        this->sleep(750);

        if (this->_config->redirect_error_2_green)
        {
            // flash the reset
            this->flash_green(3, 150);
        }
        else
        {
            // flash the reset
            this->flash_red(3, 150);
        }
    }
}

void StatusLeds::update_red(unsigned long now)
{
    if (!this->_signal_red)
    {
        this->_red_out = this->_red_led;
        return;
    }

    unsigned long elapsed = now - this->_timer_red;
    if (elapsed < this->_timeout_red)
    {
        return;
    }
    this->_timer_red = now;
    this->toggle_red();
}

void StatusLeds::update_green(unsigned long now)
{
    if (!this->_signal_green)
    {
        this->_green_out = this->_green_led;
        return;
    }

    unsigned long elapsed = now - this->_timer_green;
    if (elapsed < this->_timeout_green)
    {
        return;
    }

    this->_timer_green = now;
    this->toggle_green();
}

void StatusLeds::stop_red()
{
    this->_signal_red = false;
}

void StatusLeds::stop_green()
{
    this->_signal_green = false;
}

void StatusLeds::sleep(int timeout)
{
    unsigned long start = millis();
    unsigned long _timeout = (unsigned long)timeout;

    while (_timeout > (millis() - start))
    {
        this->update();
        unsigned long elapsed = max(_timeout - (millis() - start), (unsigned long)1);
        int t = min((unsigned long)10, elapsed);
        delay(t);
    }
}

void StatusLeds::update()
{
    unsigned long now = millis();

    this->update_red(now);
    this->update_green(now);

    if (this->_config->red_pin >= 0)
    {
        pinMode(this->_config->red_pin, OUTPUT);
        digitalWrite(this->_config->red_pin, this->_red_out);
    }

    if (this->_config->green_pin >= 0)
    {
        pinMode(this->_config->green_pin, OUTPUT);
        digitalWrite(this->_config->green_pin, this->_green_out);
    }
}