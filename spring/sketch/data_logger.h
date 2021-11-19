#ifndef _DATA_LOGGER_H
#define _DATA_LOGGER_H

#include <SD.h>
#include <SPI.h>
#include <SPIMemory.h>

#include "imu.h"
#include "stats.h"
#include "config.h"
#include "status_leds.h"
#include "remote_message.h"
#include "flight_observer.h"
#include "altitude_manager.h"
#include "data_logger_entry.h"
#include "parachute_manager.h"
#include "voltage_measurement.h"

class DataLogger
{
public:
  DataLogger();

  bool setup(Stats *stats, StatusLeds *status_leds, AltitudeManager *altitude_manager, VoltageMeasurement *voltage_measurement, IMU *imu, ParachuteManager *parachute_manager, FlightObserver *flight_observer);
  void update();
  
  bool done();

  void load_remote_message(RemoteMessage &message);
  void load_data_logger_entry(DataLoggerEntry &entry);

private:
  void write_entry_2_data_file(byte *data, uint32_t length);
  void write_entry_2_flash_memory(byte *data, uint32_t length);

  bool open_data_file();
  bool sd_card_speed_test();
  bool verify_flash_memory();
  bool flash_memory_speed_test();

  void write_entities_count_2_file();

  bool _flushed;
  bool _started;
  uint32_t _entities;

  File _data_file;
  SPIFlash _flash;

  IMU *_imu;
  Stats *_stats;
  StatusLeds *_status_leds;
  FlightObserver *_flight_observer;
  AltitudeManager *_altitude_manager;
  ParachuteManager *_parachute_manager;
  VoltageMeasurement *_voltage_measurement;
};

#endif // _DATA_LOGGER_H
