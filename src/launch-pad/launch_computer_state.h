#ifndef _LAUNCH_COMPUTER_STATE_H
#define _LAUNCH_COMPUTER_STATE_H

enum LaunchComputerState
{
    // nothing happens
    LAUNCH_COMPUTER_LOCKED,

    // bring the launch computer to startup
    LAUNCH_COMPUTER_STARTUP,
    // wait for rocket connected
    LAUNCH_COMPUTER_WAIT_FOR_ROCKET,

    // start pressurising
    LAUNCH_COMPUTER_PRESSURISING,
    // wait for target pressure reached
    LAUNCH_COMPUTER_WAIT_FOR_PRESSURE,

    // let the rocket pressure tank chill
    LAUNCH_COMPUTER_WAIT_TANK_CHILL,

    // bring the rocket in startup
    LAUNCH_COMPUTER_ROCKET_STARTUP,
    // wait for rocket startup
    LAUNCH_COMPUTER_WAIT_ROCKET_STARTUP,

    // start the launch countdown
    LAUNCH_COMPUTER_LAUNCH_COUNTDOWN,
    // launch the rocket
    LAUNCH_COMPUTER_LAUNCH,

    // wait for lift off
    LAUNCH_COMPUTER_WAIT_LIFT_OFF,

    // state if the user abort the launch
    LAUNCH_COMPUTER_ABORT_BY_USER,
    // state after successful launch
    LAUNCH_COMPUTER_ABORT_AFTER_LAUNCH,
    // abort while rocket has an error
    LAUNCH_COMPUTER_ABORT_ROCKET_ERROR,
    // abort because rocket lost connection
    LAUNCH_COMPUTER_ABORT_CONNECTION_LOST,
    // abort because pressurising took to long
    LAUNCH_COMPUTER_ABORT_PRESSURISING_TIMEOUT,
    // abort because rocket startup took to long
    LAUNCH_COMPUTER_ABORT_ROCKET_STARTUP_TIMEOUT,
};

#endif // _LAUNCH_COMPUTER_STATE_H