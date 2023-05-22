#ifndef _DATA_LOGGER_H
#define _DATA_LOGGER_H

#include <Print.h>
#include <Arduino.h>

#include <SD.h>
#include <SPI.h>
#include <SPIMemory.h>

#include "leds.h"
#include "data_logger_config.h"

class DataLogger
{
public:
    DataLogger();

    bool setup(DataLoggerConfig *config, Leds *leds, Print *print);

    bool done();
    bool write(uint8_t *buf);

private:
    bool init_sd();
    bool init_flash();

    bool write_sd(uint8_t *buf);
    bool write_flash(uint8_t *buf);

    bool print_sd_info();
    bool open_next_data_file();

    bool print_flash_info();
    bool inspect_flash();
    bool erase_full_flash();
    bool update_flash_entities();
    uint32_t entry_address(uint32_t i);

    bool copy_flash_2_sd();

    uint32_t _entities;
    uint32_t _flash_type_address;
    uint32_t _flash_entities_address;
    uint32_t _entities_address_offset;

    File _data_file;
    SPIFlash *_flash;

    Leds *_leds;
    Print *_print;
    DataLoggerConfig *_config;
};

#endif // _DATA_LOGGER_H