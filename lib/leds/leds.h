#ifndef _LEDS_H
#define _LEDS_H

class Leds
{
public:
    virtual void update() = 0;
    virtual void error(int error) = 0;
    virtual void sleep(int timeout) = 0;
};

#endif // _LEDS_H