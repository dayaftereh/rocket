#ifndef _DATA_LOGGER_H
#define _DATA_LOGGER_H

#include <SD.h>
#include <SPI.h>
#include <SPIMemory.h>

#include "../imu/imu.h"
#include "../utils/leds.h"
#include "../utils/stats.h"
#include "../config/config.h"
#include "../flight_observer.h"
#include "../net/remote_message.h"
#include "../altitude/altitude_manager.h"
#include "../parachute/parachute_manager.h"
#include "../voltage/voltage_measurement.h"

#include "data_logger_entry.h"

class DataLogger
{
public:
  DataLogger();

  bool setup(Stats *stats, LEDs *leds, AltitudeManager *altitude_manager, VoltageMeasurement *voltage_measurement, IMU *imu, ParachuteManager *parachute_manager, FlightObserver *flight_observer);
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
  LEDs *_leds;
  Stats *_stats;
  FlightObserver *_flight_observer;
  AltitudeManager *_altitude_manager;
  ParachuteManager *_parachute_manager;
  VoltageMeasurement *_voltage_measurement;
};

#endif // _DATA_LOGGER_H
