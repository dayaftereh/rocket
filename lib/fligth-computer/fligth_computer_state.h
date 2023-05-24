#ifndef _FLIGHT_COMPUTER_STATE_H
#define _FLIGHT_COMPUTER_STATE_H

enum FlightComputerState
{
    FLIGHT_COMPUTER_LOCKED,

    FLIGHT_COMPUTER_INIT,
    FLIGHT_COMPUTER_STARTUP,

    FLIGHT_COMPUTER_WAIT_FOR_LAUNCH,
    FLIGHT_COMPUTER_LAUNCHED,

    FLIGHT_COMPUTER_WAIT_FOR_LIFT_OFF,
    FLIGHT_COMPUTER_LIFT_OFF,

    FLIGHT_COMPUTER_WAIT_FOR_MECO,
    FLIGHT_COMPUTER_MECO,

    FLIGHT_COMPUTER_COASTING,
    FLIGHT_COMPUTER_APOGEE,

    FLIGHT_COMPUTER_WAIT_FOR_LANDED,
    FLIGHT_COMPUTER_LANDED,

    FLIGHT_COMPUTER_TERMINATING,

    FLIGHT_COMPUTER_IDLE,

};

#endif // _FLIGHT_COMPUTER_STATE_H