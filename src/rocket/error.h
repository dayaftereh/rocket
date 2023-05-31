#ifndef _ERROR_H
#define _ERROR_H

enum Error
{
    ERROR_DATA_LOGGER = 1,
    ERROR_IST_8310,
    ERROR_MPU_6050,
    ERROR_MADGWICK,
    ERROR_IMU,
    ERROR_STATS,
    ERROR_FLIGHT_COMPUTER,
    ERROR_ROCKET_CONTROLLER,
    ERROR_IO,
    ERROR_CONFIG_MANAGER,
    ERROR_ROCKET_CLIENT,
};

#endif // _ERROR_H