#ifndef _ROCKET_H
#define _ROCKET_H

#include <Arduino.h>

class Rocket
{
public:
    virtual void rocket_start() = 0;
    virtual void rocket_abort() = 0;
    virtual void rocket_unlock() = 0;
};

#endif // _ROCKET_H