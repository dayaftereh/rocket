#include "data_logger.h"

DataLogger::DataLogger() : _flash(DATA_LOGGER_FLASH_CS)
{
}

bool DataLogger::setup(Stats *stats, LEDs *leds, AltitudeManager *altitude_manager, VoltageMeasurement *voltage_measurement, IMU *imu, ParachuteManager *parachute_manager, FlightObserver *flight_observer)
{
  this->_flushed = false;
  this->_started = false;

  this->_imu = imu;
  this->_leds = leds;
  this->_stats = stats;
  this->_flight_observer = flight_observer;
  this->_altitude_manager = altitude_manager;
  this->_parachute_manager = parachute_manager;
  this->_voltage_measurement = voltage_measurement;

  // start the spi
  SPI.begin();

  // timeout
  this->_leds->sleep(10);

  bool success = SD.begin(DATA_LOGGER_SD_CS);
  if (!success)
  {
    Serial.println("fail to initialize sd card.");
    return false;
  }

  this->print_sd_info();

  // test the sd card for speed
  success = this->sd_card_speed_test();
  if (!success)
  {
    return false;
  }

  // find and open the data file
  success = this->open_data_file();
  if (!success)
  {
    return false;
  }

  // check if flash memory enabled
  if (!DATA_LOGGER_USE_FLASH)
  {
    Serial.println("flash memory is disabled");
    return true;
  }

  Serial.println("configuring flash memory");

  // start the memory flash
  success = this->_flash.begin();
  if (!success)
  {
    Serial.println(this->_flash.error(true));
    Serial.println("fail to initialize flash memory.");
    return false;
  }

  // update the led status for initialize
  this->_leds->sleep(10);

  // verify the flash memory
  success = this->verify_flash_memory();
  if (!success)
  {
    Serial.println("fail to verify flash memory.");
    return false;
  }

  Serial.println("ereasing full flash chip...");

  success = this->erase_full_flash();
  if (!success)
  {
    Serial.println("fail to erase full flash memory.");
    return false;
  }

  // test the flash memory for speed
  success = this->flash_memory_speed_test();
  if (!success)
  {
    return false;
  }

  return true;
}

bool DataLogger::sd_card_speed_test()
{
  Serial.println("starting sd card speedtest...");
  // file name for the speedtest
  String filename = "/speedtest.dat";
  // check if the file already exists
  bool exists = SD.exists(filename);
  if (exists)
  {
    Serial.printf("removing speedtest file [ %s ] from sd card...\n", filename.c_str());
    // remove the speedtest file
    bool success = SD.remove(filename);
    if (!success)
    {
      Serial.printf("fail to remove speedtest file [ %s ] from sd card.\n", filename.c_str());
      return false;
    }

    Serial.printf("speedtest file [ %s ] successful removed from sd card\n", filename.c_str());
  }

  // open the speedtest file
  File speedtest = SD.open(filename, "w");

  // get back to the begining
  bool success = speedtest.seek(0);
  if (!success)
  {
    // close the file
    speedtest.close();
    Serial.println("fail to seek to the start of the speedtest file.");
    return false;
  }

  int length = 128;
  byte buf[length];
  for (int i = 0; i < length; i++)
  {
    this->_leds->update();
    buf[i] = random(0, 255);
  }

  int writes = 1000;
  uint64_t elapsed_time = 0;
  for (int i = 0; i < writes; i++)
  {
    uint64_t start = millis();
    size_t bytes = speedtest.write(buf, length);
    elapsed_time += (millis() - start);

    if (bytes != length)
    {
      Serial.printf("Fail to write speedtest file, bytes missmatch [ %d != %d ] \n", bytes, length);
      return false;
    }
    
    this->_leds->update();
  }

  float elapsed = ((float)elapsed_time) / 1000.0;
  float speed = ((float)(writes * length)) / elapsed;

  Serial.print("sd card speed is [ ");
  Serial.print(speed);
  Serial.println(" byte/s ]");

  speedtest.close();
  return true;
}

bool DataLogger::print_sd_info()
{
  uint8_t card_type = SD.cardType();
  if (card_type == CARD_NONE)
  {
    Serial.println("No SD card attached");
    return false;
  }

  Serial.print("SD Card Type: ");
  if (card_type == CARD_MMC)
  {
    Serial.println("MMC");
  }
  else if (card_type == CARD_SD)
  {
    Serial.println("SDSC");
  }
  else if (card_type == CARD_SDHC)
  {
    Serial.println("SDHC");
  }
  else
  {
    Serial.println("UNKNOWN");
  }

  uint64_t card_size = SD.cardSize() / (1024 * 1024);
  Serial.printf("SD Card Size: %llu MB\n", card_size);

  return true;
}

bool DataLogger::open_data_file()
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

    Serial.print("opening data file with name[ ");
    Serial.print(filename);
    Serial.println(" ]");

    return true;
  }

  // print an error
  Serial.println("unable to find a free data filename. please cleanup old data files and retry");
  return false;
}

bool DataLogger::verify_flash_memory()
{
  // get the id
  uint32_t JEDEC = this->_flash.getJEDECID();
  if (!JEDEC)
  {
    Serial.println("No comms. Check wiring. Is the memory flash chip supported?");
    return true;
  }

  Serial.print("Man ID: 0x");
  Serial.println(uint8_t(JEDEC >> 16), HEX);

  Serial.print("Memory ID: 0x");
  Serial.println(uint8_t(JEDEC >> 8), HEX);

  Serial.print("Capacity: ");
  Serial.println(this->_flash.getCapacity());

  Serial.print("Max Pages: ");
  Serial.println(this->_flash.getMaxPage());

  long long uniqueID = this->_flash.getUniqueID();
  Serial.print("UniqueID: 0x");
  Serial.print(uint32_t(uniqueID >> 32), HEX);
  Serial.println(uint32_t(uniqueID), HEX);

  return true;
}

bool DataLogger::erase_full_flash()
{
  uint32_t address = 0;
  uint32_t section_length = KB(32);
  uint32_t capacity = this->_flash.getCapacity();

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
    bool success = this->_flash.eraseSection(address, length);
    // move address to next section
    address += section_length;
    // update the leds
    this->_leds->update();
  }

  return true;
}

bool DataLogger::flash_memory_speed_test()
{
  Serial.println("starting flash memory speedtest...");

  size_t length = 128;
  byte buf[length];
  for (int i = 0; i < length; i++)
  {
    this->_leds->update();
    buf[i] = random(0, 255);
  }

  size_t loops = 1000;
  uint64_t elapsed_time = 0;

  for (int i = 0; i < loops; i++)
  {
    uint32_t address = i * length + 1;

    // check the time taken
    uint64_t now = millis();
    bool success = this->_flash.writeByteArray(address, &buf[0], length);
    elapsed_time += millis() - now;

    if (!success)
    {
      Serial.println(this->_flash.error(true));
      Serial.println("fail to write to flash memory");
      return false;
    }
    this->_leds->update();
  }

  size_t total_length = (loops * length);

  float elapsed = ((float)(elapsed_time)) / 1000.0;
  float speed = ((float)total_length) / elapsed;

  Serial.print("flash memory write speed is [ ");
  Serial.print(speed);
  Serial.println(" byte/s ]");

  elapsed_time = 0;
  byte buf2[length];
  for (int i = 0; i < loops; i++)
  {
    uint32_t address = i * length + 1;

    // check the time taken
    uint64_t now = millis();
    bool success = this->_flash.readByteArray(address, &buf2[0], length);
    elapsed_time += millis() - now;

    if (!success)
    {
      Serial.println(this->_flash.error());
      Serial.println("fail to read from flash memory");
      return false;
    }

    for (int j = 0; j < length; j++)
    {
      if (buf[j] != buf2[j])
      {
        Serial.printf("flash memory read missmatch [ %d != %d ] \n", buf[j], buf2[j]);
        return false;
      }
    }

    this->_leds->update();
  }

  elapsed = ((float)elapsed_time) / 1000.0;
  speed = ((float)total_length) / elapsed;

  Serial.print("flash memory read speed is [ ");
  Serial.print(speed);
  Serial.println(" byte/s ]");

  // clean the speedtest section
  Serial.println("erasing speedtest section...");
  bool success = this->_flash.eraseSection(0, total_length);
  if (!success)
  {
    Serial.println("fail to erase speedtest section");
    return false;
  }

  return true;
}

void DataLogger::load_data_logger_entry(DataLoggerEntry &entry)
{
  entry.time = millis();
  entry.elapsed = this->_stats->get_delta();

  entry.voltage = this->_voltage_measurement->get_voltage();
  entry.altitude = this->_altitude_manager->get_altitude_delta();

  entry.state = this->_flight_observer->get_state();
  entry.maximum_altitude = this->_flight_observer->get_maximum_altitude();

  Vec3f *velocity = this->_flight_observer->get_velocity();
  entry.velocity_x = velocity->x;
  entry.velocity_y = velocity->y;
  entry.velocity_z = velocity->z;

  Vec3f *acceleration = this->_imu->get_world_acceleration_normalized();
  entry.acceleration_x = acceleration->x;
  entry.acceleration_y = acceleration->y;
  entry.acceleration_z = acceleration->z;

  Vec3f *rotation = this->_imu->get_rotation();
  entry.rotation_x = rotation->x;
  entry.rotation_y = rotation->y;
  entry.rotation_z = rotation->z;

  entry.parachuteVelocity = this->_parachute_manager->is_velocity_triggered();
  entry.parachuteAltitude = this->_parachute_manager->is_altitude_triggered();
  entry.parachuteOrientation = this->_parachute_manager->is_orientation_triggered();
}

void DataLogger::load_remote_message(RemoteMessage &message)
{
  message.time = millis();
  message.elapsed = this->_stats->get_delta();

  message.voltage = this->_voltage_measurement->get_voltage();
  message.altitude = this->_altitude_manager->get_altitude_delta();

  Vec3f *gyroscope = this->_imu->get_gyroscope();
  message.gyroscope_x = gyroscope->x;
  message.gyroscope_y = gyroscope->y;
  message.gyroscope_z = gyroscope->z;

  Vec3f *acceleration = this->_imu->get_world_acceleration();
  message.acceleration_x = acceleration->x;
  message.acceleration_y = acceleration->y;
  message.acceleration_z = acceleration->z;

  Vec3f *magnetometer = this->_imu->get_magnetometer();
  message.magnetometer_x = magnetometer->x;
  message.magnetometer_y = magnetometer->y;
  message.magnetometer_z = magnetometer->z;

  Vec3f *rotation = this->_imu->get_rotation();
  message.rotation_x = rotation->x;
  message.rotation_y = rotation->y;
  message.rotation_z = rotation->z;

  message.locked = this->_flight_observer->is_locked();

  message.parachuteVelocity = this->_parachute_manager->is_velocity_triggered();
  message.parachuteAltitude = this->_parachute_manager->is_altitude_triggered();
  message.parachuteOrientation = this->_parachute_manager->is_orientation_triggered();
}

void DataLogger::write_entry_2_data_file(byte *data, uint32_t length)
{
  // write the entry to data file
  this->_data_file.write(data, length);
  this->_entities++;
}

void DataLogger::write_entry_2_flash_memory(byte *data, uint32_t length)
{
  // get the next flash memory address
  uint32_t address = length * this->_entities;
  // calculate the final length
  uint32_t memory_filled = address + length;

  // check if the flash memory full
  if (memory_filled > this->_flash.getCapacity())
  {
    return;
  }
  // write the entry to flash memory
  bool success = this->_flash.writeByteArray(address, data, length);

  this->_entities++;
}

void DataLogger::update()
{
  // check if data logger started
  if (!this->_flight_observer->is_launched())
  {
    // check if started, but not jet flushed
    if (this->_started && !this->_flushed)
    {
      this->done();
    }
    return;
  }
  // set started to true
  this->_started = true;

  // load the data logger entry
  DataLoggerEntry entry;
  this->load_data_logger_entry(entry);

  // ------------------

  // get the size of the struct
  size_t struct_size = sizeof(entry);
  // get the struct as byte point
  byte *data = (byte *)&entry;

  // check if flash memory enabled
  if (DATA_LOGGER_USE_FLASH)
  {
    this->write_entry_2_flash_memory(data, struct_size);
  }
  else
  {
    this->write_entry_2_data_file(data, struct_size);
  }
}

void DataLogger::write_entities_count_2_file()
{
  // convert the entities to byte pointer
  uint8_t *bytes;
  bytes = (uint8_t *)&this->_entities;

  // write the entities count
  this->_data_file.write(bytes, sizeof(this->_entities));
}

bool DataLogger::done()
{
  this->_flushed = true;

  // check if flash memory enabled
  if (!DATA_LOGGER_USE_FLASH)
  {
    // flush the bytes to file
    this->_data_file.flush();
    return true;
  }

  // write the entities count to data file
  this->write_entities_count_2_file();

  // calculate the data size for the copy
  uint32_t data_size = this->_entities * sizeof(DataLoggerEntry);

  // set the buffer length
  uint32_t buf_length = 1024;
  // create a copy buffer
  byte buf[1024];

  // copy the data from flash to sd card
  for (uint32_t i = 0; i < data_size; i += buf_length)
  {
    // update the status led
    this->_leds->update();
    // read the data from flash memory
    this->_flash.readByteArray(i, buf, buf_length);

    // write the buffer to sd file
    uint32_t n = this->_data_file.write(buf, buf_length);
    if (n != buf_length)
    {
      Serial.println("fail to write data from flash memory to data-file, because mismatch of written bytes.");
      return false;
    }
  }

  // flush the bytes to file
  this->_data_file.flush();

  return true;
}
