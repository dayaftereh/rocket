#ifndef _DATA_LOGGER_H
#define _DATA_LOGGER_H

#include<SD.h>
#include<SPI.h>
#include<SPIMemory.h>

#include "config.h"
#include "status_leds.h"

class DataLogger
{
  public:
    DataLogger();

    bool setup(StatusLeds *status_leds);

  private:

    bool open_data_file();
    bool sd_card_speed_test();
    bool verify_flash_memory();

    File _data_file;
    SPIFlash *_flash;
    StatusLeds *_status_leds;
};

#endif // _DATA_LOGGER_H
