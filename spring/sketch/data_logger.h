#ifndef _DATA_LOGGER_H
#define _DATA_LOGGER_H

#include<SD.h>
#include<SPI.h>
#include<SPIMemory.h>

#include "stats.h"
#include "config.h"
#include "status_leds.h"
#include "motion_manager.h"
#include "altitude_manager.h"
#include "data_logger_entry.h"
#include "voltage_measurement.h"

class DataLogger
{
  public:
    DataLogger();

    bool setup(Stats *stats, StatusLeds *status_leds, AltitudeManager *altitude_manager, VoltageMeasurement *voltage_measurement, MotionManager *motion_manager);
    void update();

    void start();
    bool done();

    void load_data_logger_entry(DataLoggerEntry &entry);

  private:

    bool open_data_file();
    bool sd_card_speed_test();
    bool verify_flash_memory();
    bool flash_memory_speed_test();

    void write_entities_count_2_file();

    bool _started;
    uint32_t _entities;

    File _data_file;
    SPIFlash *_flash;

    Stats *_stats;
    StatusLeds *_status_leds;
    MotionManager *_motion_manager;
    AltitudeManager *_altitude_manager;
    VoltageMeasurement *_voltage_measurement;
};

#endif // _DATA_LOGGER_H
