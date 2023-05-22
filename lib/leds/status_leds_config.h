#ifndef _STATUS_LEDS_CONFIG_H
#define _STATUS_LEDS_CONFIG_H

typedef struct
{
    int red_pin;
    int green_pin;
    bool redirect_error_2_green;
} StatusLedsConfig;

#endif // _STATUS_LEDS_CONFIG_H