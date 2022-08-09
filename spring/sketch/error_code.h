#ifndef _ERROR_CODE_H
#define _ERROR_CODE_H

enum ErrorCode
{
  ERROR_CONFIG_MANAGER = 1,
  ERROR_DATA_LOGGER,
  ERROR_IMU,
  ERROR_ALTITUDE_MANAGER,
  ERROR_VOLTAGE_MEASUREMENT,
  ERROR_STATS,
  ERROR_FLIGHT_OBSERVER,
  ERROR_REMOTE_SERVER,
  ERROR_PARACHUTE_MANAGER,
  ERROR_NETWORKING,
  ERROR_MPU_6050,
  ERROR_QMC_5883L,
  ERROR_MADGWICK
};

#endif // _ERROR_CODE_H