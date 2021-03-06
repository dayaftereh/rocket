#include "data_logger.h"

DataLogger::DataLogger()
{
}

bool DataLogger::setup(DataLoggerConfig *config, Leds *leds, Print *print)
{
    this->_leds = leds;
    this->_print = print;
    this->_config = config;

    this->_flash_type_address = 4;
    this->_flash_entities_address = 6;
    this->_entities_address_offset = 100;

    // initialize sd card
    bool success = this->init_sd();
    if (!success)
    {
        this->_print->println("fail to initialize sd card");
        return false;
    }

    this->_leds->update();

    // check if use flash
    if (!this->_config->use_flash)
    {
        return true;
    }

    success = this->init_flash();
    if (!success)
    {
        this->_print->println("fail to initialize flash");
        return false;
    }

    return true;
}

bool DataLogger::init_sd()
{
    // start the sd card
    bool success = SD.begin(this->_config->sd_card_cs);
    if (!success)
    {
        this->_print->println("fail to begin sd card.");
        return false;
    }

    // check if sd card ready
    success = this->print_sd_info();
    if (!success)
    {
        return false;
    }

    // open the data file
    success = this->open_next_data_file();
    if (!success)
    {
        return false;
    }

    return true;
}

bool DataLogger::print_sd_info()
{
    uint8_t card_type = SD.cardType();
    if (card_type == CARD_NONE)
    {
        this->_print->println("No SD card attached");
        return false;
    }

    this->_print->print("SD Card Type: ");
    if (card_type == CARD_MMC)
    {
        this->_print->println("MMC");
    }
    else if (card_type == CARD_SD)
    {
        this->_print->println("SDSC");
    }
    else if (card_type == CARD_SDHC)
    {
        this->_print->println("SDHC");
    }
    else
    {
        this->_print->println("UNKNOWN");
    }

    uint32_t card_size = (uint32_t)(SD.cardSize() / (1024 * 1024));

    this->_print->print("SD Card Size: MB");
    this->_print->print(card_size);
    this->_print->println("MB");

    return true;
}

bool DataLogger::open_next_data_file()
{
    for (int i = 0; i < 100; i++)
    {
        // create the data-file for the data
        String prefix = "/data_";
        String filename = prefix + i;
        filename = filename + ".dat";

        // update the led status for initialize
        this->_leds->update();

        // check if the data file already exists
        bool exists = SD.exists(filename);

        // go to next file
        if (exists)
        {
            continue;
        }
        // open the data file for write
        this->_data_file = SD.open(filename, FILE_WRITE);

        this->_print->print("opening data file with name[ ");
        this->_print->print(filename);
        this->_print->println(" ]");

        // write the type to the data file
        this->_data_file.write(this->_config->type);

        // write the entry size to file
        uint8_t size_low = lowByte(this->_config->entry_size);
        uint8_t size_high = highByte(this->_config->entry_size);
        // write the entry size to file (first high then low)
        this->_data_file.write(size_high);
        this->_data_file.write(size_low);

        return true;
    }

    // print an error
    this->_print->println("unable to find a free data filename. please cleanup old data files and retry");
    return false;
}

bool DataLogger::init_flash()
{
    // create memory the flash
    this->_flash = new SPIFlash(this->_config->flash_cs);
    // start the memory flash
    bool success = this->_flash->begin();
    if (!success)
    {
        this->_print->println(this->_flash->error(true));
        this->_print->println("fail to initialize flash memory.");
        return false;
    }

    // output flash information
    success = this->print_flash_info();
    if (!success)
    {
        return false;
    }

    // check if flash is ready and not data left
    success = this->inspect_flash();
    if (!success)
    {
        return false;
    }

    return true;
}

bool DataLogger::print_flash_info()
{
    // get the id
    uint32_t JEDEC = this->_flash->getJEDECID();
    if (!JEDEC)
    {
        this->_print->println("No comms. Check wiring. Is the memory flash chip supported?");
        return false;
    }

    this->_print->print("Man ID: 0x");
    this->_print->println(uint8_t(JEDEC >> 16), HEX);

    this->_print->print("Memory ID: 0x");
    this->_print->println(uint8_t(JEDEC >> 8), HEX);

    this->_print->print("Capacity: ");
    this->_print->println(this->_flash->getCapacity());

    this->_print->print("Max Pages: ");
    this->_print->println(this->_flash->getMaxPage());

    long long uniqueID = this->_flash->getUniqueID();
    this->_print->print("UniqueID: 0x");
    this->_print->print(uint32_t(uniqueID >> 32), HEX);
    this->_print->println(uint32_t(uniqueID), HEX);

    return true;
}

bool DataLogger::inspect_flash()
{
    // read the type from the flash
    uint8_t type = this->_flash->readByte(this->_flash_type_address);

    if (type != this->_config->type || this->_config->force_full_flush_erase)
    {
        this->_print->print("erase full flash, because type miss match [ ");
        this->_print->print(type);
        this->_print->print(" != ");
        this->_print->print(this->_config->type);
        this->_print->print(" ] or force of full flush erase [ ");
        this->_print->print(this->_config->force_full_flush_erase);
        this->_print->println(" ]");

        // clean up and ready the flash
        bool success = this->erase_full_flash();
        return success;
    }

    // read the entities from flash
    this->_entities = this->_flash->readULong(this->_flash_entities_address);

    this->_print->print("flash contains [ ");
    this->_print->print(this->_entities);
    this->_print->println(" ] entities");

    // if no entities on the flash we are done
    if (this->_entities <= 0)
    {
        return true;
    }

    // copy the flash to sd
    bool success = this->copy_flash_2_sd();
    if (!success)
    {
        this->_print->println("fail to copy entities to sd card");
        return false;
    }

    // open next data file
    success = this->open_next_data_file();
    if (!success)
    {
        return false;
    }

    // reset entities to zero
    this->_entities = 0;

    return true;
}

bool DataLogger::erase_full_flash()
{
    // start with the start address
    uint32_t address = 0;
    // erase section by section
    uint32_t section_length = KB(32);
    // get the full length
    uint32_t capacity = this->_flash->getCapacity();

    while (address < capacity)
    {
        // get the next section length
        uint32_t length = section_length;
        // cop the section length if needed
        if ((address + length) > capacity)
        {
            length = capacity - address;
        }

        // erase the section
        bool success = this->_flash->eraseSection(address, length);
        if (!success)
        {
            this->_print->print("fail to erase section [ addr: ");
            this->_print->print(address, HEX);
            this->_print->print(", len: ");
            this->_print->print(length);
            this->_print->println(" ]");
            return false;
        }
        // move address to next section
        address += section_length;
        // update the leds
        this->_leds->update();
    }
    // write the data entry type to the flash
    bool success = this->_flash->writeByte(this->_flash_type_address, this->_config->type);
    if (!success)
    {
        this->_print->println("fail to write data type to flush");
        return false;
    }

    // zero the entities
    this->_entities = 0;
    // write the zero count to flash
    success = this->update_flash_entities();
    if (!success)
    {
        return false;
    }

    this->_print->println("full flush erase successful completed");

    return true;
}

uint32_t DataLogger::entry_address(uint32_t i)
{
    // calculate the entry address
    uint32_t address = this->_entities_address_offset + (i * this->_config->entry_size);
    return address;
}

bool DataLogger::copy_flash_2_sd()
{
    this->_print->print("starting copy of [ ");
    this->_print->print(this->_entities);
    this->_print->println(" ] entities to sd card");

    // copy entry by entry
    for (uint32_t i = 0; i < this->_entities; i++)
    {
        // create a copy buffer for 1 entry
        uint8_t buf[this->_config->entry_size];
        // calculate the entry address
        uint32_t address = this->entry_address(i);
        // read the data entry from flash memory
        bool success = this->_flash->readByteArray(address, buf, this->_config->entry_size);
        if (!success)
        {
            this->_print->print("fail to read data entry [ i: ");
            this->_print->print(i);
            this->_print->print(", addr: ");
            this->_print->print(address, HEX);
            this->_print->print(", len: ");
            this->_print->print(this->_config->entry_size);
            this->_print->println(" ] from flash");
            return false;
        }

        // write the entry to sd card file
        size_t n = this->_data_file.write(buf, this->_config->entry_size);
        // check if equals bytes written
        if (n != this->_config->entry_size)
        {
            return false;
        }

        this->_leds->update();
    }

    // flash the data to the file
    this->_data_file.flush();
    // close the data file
    this->_data_file.close();

    this->_print->print("successful copied [ ");
    this->_print->print(this->_entities);
    this->_print->println(" ] entities to sd card and starting erase entities from flush");

    // erase now the _entities
    for (uint32_t i = 0; i < this->_entities; i++)
    {
        // calculate the entry address
        uint32_t address = this->entry_address(i);
        bool success = this->_flash->eraseSection(address, this->_config->entry_size);
        if (!success)
        {
            this->_print->print("fail to erase section for data entry [ i: ");
            this->_print->print(i);
            this->_print->print(", addr: ");
            this->_print->print(address, HEX);
            this->_print->print(", len: ");
            this->_print->print(this->_config->entry_size);
            this->_print->println(" ] from flash");
            return false;
        }
    }

    // zero the entities
    this->_entities = 0;
    // write the zero count to flash
    bool success = this->update_flash_entities();
    if (!success)
    {
        return false;
    }

    this->_print->println("successful erased all entities from flush");

    return true;
}

bool DataLogger::write(uint8_t *buf)
{
    // check if use flash
    if (this->_config->use_flash)
    {
        bool success = this->write_flash(buf);
        return success;
    }

    bool success = this->write_sd(buf);
    return success;
}

bool DataLogger::write_flash(uint8_t *buf)
{
    // calculate the next entry address
    uint32_t address = this->entry_address(this->_entities);

    // check if the flash is full
    if (address > this->_flash->getCapacity())
    {
        return true;
    }

    // write the entry data
    bool success = this->_flash->writeByteArray(address, buf, this->_config->entry_size);
    if (!success)
    {
        this->_print->print("fail to write data entry [ i: ");
        this->_print->print(this->_entities);
        this->_print->print(", addr: ");
        this->_print->print(address, HEX);
        this->_print->print(", len: ");
        this->_print->print(this->_config->entry_size);
        this->_print->print(" ] to flash, because ");
        this->_print->println(this->_flash->error(true));
        return false;
    }

    // increment the entities by one
    this->_entities++;
    success = this->update_flash_entities();
    if (!success)
    {
        return false;
    }

    return true;
}

bool DataLogger::update_flash_entities()
{

    // update the current entities count at the flash
    bool success = this->_flash->writeULong(this->_flash_entities_address, this->_entities);
    if (!success)
    {
        this->_print->print("fail to update entities count on flash [");
        this->_print->print(this->_flash->error(true));
        this->_print->println(" ]");
        return false;
    }

    return true;
}

bool DataLogger::write_sd(uint8_t *buf)
{
    uint32_t n = (uint32_t)this->_data_file.write(buf, this->_config->entry_size);
    return n == this->_config->entry_size;
}

bool DataLogger::done()
{
    // check if use flash given
    if (!this->_config->use_flash)
    {
        // flush the sd card file and close
        this->_data_file.flush();
        this->_data_file.close();
        return true;
    }
    // copy data from flash 2 sd card
    bool success = this->copy_flash_2_sd();
    return success;
}
