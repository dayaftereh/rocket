#ifndef _TRIGGER_MANAGER_H
#define _TRIGGER_MANAGER_H

#include <Arduino.h>

#include "../utils/leds.h"
#include "../config/config.h"

class TriggerManager
{
public:
    TriggerManager();

    bool setup(LEDs *leds);

    void l1_on();
    void l1_off();

    void l2_on();
    void l2_off();

    void update();

private:
    bool _l1;
    bool _l2;

    LEDs *_leds;
};

#endif // _TRIGGER_MANAGER_H
