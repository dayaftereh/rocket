#ifndef _STATUS_LEDS_H
#define _STATUS_LEDS_H

#include <Print.h>
#include <Arduino.h>

#include "leds.h"
#include "status_leds_config.h"

class StatusLeds : public Leds
{
public:
    StatusLeds();

    void setup(StatusLedsConfig *config, Print *print);
    void update();

    void on_red();
    void off_red();

    void on_green();
    void off_green();

    void flash_red(int count, int timeout);
    void flash_green(int count, int timeout);

    void singal_red(int timeout);
    void singal_green(int timeout);

    void stop_red();
    void stop_green();

    void error(int error);
    void sleep(int timeout);

private:
    void toggle_red();
    void toggle_green();

    void update_red(unsigned long now);
    void update_green(unsigned long now);

    bool _red_out;
    bool _green_out;

    bool _red_led;
    bool _green_led;

    bool _signal_red;
    bool _signal_green;

    unsigned long _timer_red;
    unsigned long _timeout_red;

    unsigned long _timer_green;
    unsigned long _timeout_green;

    Print *_print;
    StatusLedsConfig *_config;
};

#endif // _STATUS_LEDS_H