#ifndef _FLIGHT_COMPUTER_EVENT_HANDLER_H
#define _FLIGHT_COMPUTER_EVENT_HANDLER_H

class FlightComputerEventHandler
{
public:
    virtual bool init() = 0;
    virtual void locked() = 0;
    virtual void startup() = 0;
    virtual void launched() = 0;
    virtual void lift_off() = 0;
    virtual void meco() = 0;
    virtual void apogee() = 0;
    virtual void landed() = 0;
    virtual void terminated() = 0;
    virtual void idle() = 0;
};

#endif // _FLIGHT_COMPUTER_EVENT_HANDLER_H