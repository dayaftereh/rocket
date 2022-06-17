#include "data_logger.h"

DataLogger::DataLogger() : _flash(DATA_LOGGER_FLASH_CS)
{
}

bool DataLogger::setup(Stats *stats, StatusLeds *status_leds, AltitudeManager *altitude_manager, VoltageMeasurement *voltage_measurement, IMU *imu, ParachuteManager *parachute_manager, FlightObserver *flight_observer)
{
  this->_flushed = false;
  this->_started = false;

  this->_imu = imu;
  this->_stats = stats;
  this->_status_leds = status_leds;
  this->_flight_observer = flight_observer;
  this->_altitude_manager = altitude_manager;
  this->_parachute_manager = parachute_manager;
  this->_voltage_measurement = voltage_measurement;

  SPI.begin();

  bool success = SD.begin(DATA_LOGGER_SD_CS);
  if (!success)
  {
    Serial.println("fail to initialize sd card.");
    return false;
  }

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
  success = this->_flash.begin(MB(16));
  if (!success)
  {
    Serial.println(this->_flash.error(true));
    Serial.println("fail to initialize flash memory.");
    return false;
  }

  // update the led status for initialize
  this->_status_leds->progress();

  // verify the flash memory
  success = this->verify_flash_memory();
  if (!success)
  {
    Serial.println("fail to verify flash memory.");
    return false;
  }

  success = this->_flash.eraseSection(0, 1000);
  if (!success)
  {
    Serial.println("fail to erase flash memory.");
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
  String filename = "speedtest.dat";
  // check if the file already exists
  bool exists = SD.exists(filename);
  if (exists)
  {
    Serial.println("removing speedtest file from sd card...");
    // remove the speedtest file
    bool success = SD.remove(filename);
    if (!success)
    {
      Serial.println("fail to remove speedtest file from sd card.");
      return false;
    }
  }

  // open the speedtest file
  File speedtest = SD.open(filename, FILE_WRITE);
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
    this->_status_leds->progress();
    buf[i] = random(0, 255);
  }

  int writes = 1000;
  unsigned long start = millis();
  for (int i = 0; i < writes; i++)
  {
    speedtest.write(buf, length);
    this->_status_leds->progress();
  }

  float elapsed = ((float)(millis() - start)) / 1000.0;
  float speed = ((float)(writes * length)) / elapsed;

  Serial.print("sd card speed is [ ");
  Serial.print(speed);
  Serial.println(" byte/s ]");

  speedtest.close();
  return true;
}

bool DataLogger::open_data_file()
{
  for (int i = 0; i < 100; i++)
  {
    // create the data-file for the data
    String prefix = "data_";
    String filename = prefix + i;
    filename = filename + ".dat";

    // update the led status for initialize
    this->_status_leds->progress();

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

bool DataLogger::flash_memory_speed_test()
{
  Serial.println("starting flash memory speedtest...");

  int length = 128;
  byte buf[length];
  for (int i = 0; i < length; i++)
  {
    this->_status_leds->progress();
    buf[i] = random(0, 255);
  }

  int writes = 1000;
  unsigned long start = millis();
  for (int i = 0; i < writes; i++)
  {
    uint32_t address = i * length + 1;
    bool success = this->_flash.writeByteArray(address, &buf[0], length);
    /*if (!success)
    {
      Serial.println(this->_flash.error(true));
      Serial.println("fail to write to flash memory");
      return false;
    }*/
    this->_status_leds->progress();
  }

  float elapsed = ((float)(millis() - start)) / 1000.0;
  float speed = ((float)(writes * length)) / elapsed;

  Serial.print("flash memory write speed is [ ");
  Serial.print(speed);
  Serial.println(" byte/s ]");

  int reads = 1000;
  start = millis();
  byte buf2[length];
  for (int i = 0; i < reads; i++)
  {
    uint32_t address = i * length + 1;
    bool success = this->_flash.readByteArray(address, &buf2[0], length);
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
        Serial.print(i);
        Serial.print(j);
        Serial.println("flash memory read missmatch");
        return false;
      }
    }
    this->_status_leds->progress();
  }

  elapsed = ((float)(millis() - start)) / 1000.0;
  speed = ((float)(reads * length)) / elapsed;

  Serial.print("flash memory read speed is [ ");
  Serial.print(speed);
  Serial.println(" byte/s ]");

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

  Vec3f *acceleration = this->_imu->get_world_acceleration();
  entry.acceleration_x = acceleration->x;
  entry.acceleration_y = acceleration->y;
  entry.acceleration_z = acceleration->z;

  Vec3f *acceleration_normalized = this->_imu->get_world_acceleration_normalized();
  entry.filter_acceleration_x = acceleration_normalized->x;
  entry.filter_acceleration_y = acceleration_normalized->y;
  entry.filter_acceleration_z = acceleration_normalized->z;

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

  Vec3f *acceleration = this->_imu->get_acceleration();
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

  message.flight_observer_state = this->_flight_observer->get_state();

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
    this->_status_leds->finalize();
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
