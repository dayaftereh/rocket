#include "data_logger.h"

DataLogger::DataLogger() {

}

bool DataLogger::setup(Stats *stats, StatusLeds *status_leds, AltitudeManager *altitude_manager, VoltageMeasurement *voltage_measurement, MotionManager *motion_manager) {
  this->_started = false;
  
  this->_stats = stats;  
  this->_status_leds = status_leds;
  this->_motion_manager = motion_manager;
  this->_altitude_manager = altitude_manager;
  this->_voltage_measurement = voltage_measurement;

  bool success = SD.begin(DATA_LOGGER_SD_CS);
  if (!success) {
    Serial.println("fail to initialize sd card.");
    return false;
  }

  // test the sd card for speed
  success = this->sd_card_speed_test();
  if (!success) {
    return false;
  }

  // find and open the data file
  success = this->open_data_file();
  if (!success) {
    return false;
  }

  // create the memory flash
  this->_flash = new SPIFlash(DATA_LOGGER_FLASH_CS);

  // start the memory flash
  success = this->_flash->begin();
  if (!success) {
    Serial.println("fail to initialize flash memory.");
    return false;
  }

  // update the led status for initialize
  this->_status_leds->progress();

  // verify the flash memory
  success = this->verify_flash_memory();
  if (!success) {
    Serial.println("fail to verify flash memory.");
    return false;
  }

  // test the flash memory for speed
  success = this->flash_memory_speed_test();
  if (!success) {
    return false;
  }

  return true;
}

bool DataLogger::sd_card_speed_test() {
  Serial.println("starting sd card speedtest...");
  // open the speedtest file
  File speedtest = SD.open("speedtest.dat", FILE_WRITE);
  // get back to the begining
  bool success = speedtest.seek(0);
  if (!success) {
    // close the file
    speedtest.close();
    Serial.println("fail to seek to the start of the speedtest file.");
    return false;
  }

  int length = 128;
  byte buf[length];
  for (int i = 0; i < length; i++) {
    this->_status_leds->progress();
    buf[i] = random(0, 255);
  }

  int writes = 1000;
  unsigned long start = millis();
  for (int i = 0; i < writes; i++) {
    speedtest.write(buf, length);
    this->_status_leds->progress();
  }

  float elapsed = ((float)( millis() - start)) / 1000.0;
  float speed = ((float)(writes * length)) / elapsed;

  Serial.print("sd card speed is [ ");
  Serial.print(speed);
  Serial.println(" byte/s ]");

  speedtest.close();
  return true;

}

bool DataLogger::open_data_file() {
  for (int i = 0; i < 100; i++) {
    // create the data-file for the data
    String prefix = "data_";
    String filename = prefix + i;
    filename = filename + ".dat";

    // update the led status for initialize
    this->_status_leds->progress();

    // check if the data file already exists
    bool exists = SD.exists(filename);

    // go to next file
    if (exists) {
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

bool DataLogger::verify_flash_memory() {
  // get the id
  uint32_t JEDEC = this->_flash->getJEDECID();
  if (!JEDEC) {
    Serial.println("No comms. Check wiring. Is the memory flash chip supported?");
    return false;
  }

  Serial.print("Man ID: 0x");
  Serial.println(uint8_t(JEDEC >> 16), HEX);

  Serial.print("Memory ID: 0x");
  Serial.println(uint8_t(JEDEC >> 8), HEX);

  Serial.print("Capacity: ");
  Serial.println(this->_flash->getCapacity());

  Serial.print("Max Pages: ");
  Serial.println(this->_flash->getMaxPage());

  long long uniqueID = this->_flash->getUniqueID();
  Serial.print("UniqueID: 0x");
  Serial.print(uint32_t(uniqueID >> 32), HEX);
  Serial.println(uint32_t(uniqueID), HEX);

  return true;
}

bool DataLogger::flash_memory_speed_test() {
  Serial.println("starting flash memory speedtest...");

  int length = 128;
  byte buf[length];
  for (int i = 0; i < length; i++) {
    this->_status_leds->progress();
    buf[i] = random(0, 255);
  }

  int writes = 1000;
  unsigned long start = millis();
  for (int i = 0; i < writes; i++) {
    uint32_t address = i * length;
    bool success = this->_flash->writeByteArray(address, buf, length);
    this->_status_leds->progress();
  }

  float elapsed = ((float)( millis() - start)) / 1000.0;
  float speed = ((float)(writes * length)) / elapsed;

  Serial.print("flash memory speed is [ ");
  Serial.print(speed);
  Serial.println(" byte/s ]");

  return true;
}

void DataLogger::load_data_logger_entry(DataLoggerEntry &entry) {
  entry.time = millis();

  entry.voltage = this->_voltage_measurement->get_voltage();
  entry.altitude = this->_altitude_manager->get_altitude_delta();

  VectorFloat *gyroscope = this->_motion_manager->get_gyroscope();
  entry.gyroscopeX = gyroscope->x;
  entry.gyroscopeY = gyroscope->y;
  entry.gyroscopeZ = gyroscope->z;

  VectorFloat *acceleration = this->_motion_manager->get_acceleration();
  entry.accelerationX = acceleration->x;
  entry.accelerationY = acceleration->y;
  entry.accelerationZ = acceleration->z;

  VectorFloat *rotation = this->_motion_manager->get_world_rotaion();
  entry.rotationX = rotation->x;
  entry.rotationY = rotation->y;
  entry.rotationZ = rotation->z;

  entry.parachuteAltitude = false;
  entry.parachuteOrientation = false;
}

void DataLogger::update() {
  // check if data logger started
  if (!this->_started) {
    return;
  }

  Serial.println("ff");

  // load the data logger entry
  DataLoggerEntry entry;
  this->load_data_logger_entry(entry);

  // ------------------

  // get the size of the struct
  size_t struct_size = sizeof(entry);
  // get the next flash memory address
  uint32_t address = struct_size * this->_entities;
  // calculate the final length
  uint32_t length = address + struct_size;

  // check if the flash memory full
  if (length > this->_flash->getCapacity()) {
    return;
  }

  // get the struct as byte point
  byte* data = (byte*)&entry;
  // write the entry to flash memory
  bool success = this->_flash->writeByteArray(address, data, struct_size);

  this->_entities++;
}

void DataLogger::start() {
  this->_started = true;
  this->_entities = 0;
}

void DataLogger::write_entities_count_2_file() {
  // convert the entities to byte pointer
  uint8_t *bytes;
  bytes = (uint8_t*)&this->_entities;

  // write the entities count
  this->_data_file.write(bytes, sizeof(this->_entities));
}

bool DataLogger::done() {
  this->_started = false;
  // write the entities count to data file
  this->write_entities_count_2_file();

  // calculate the data size for the copy
  uint32_t data_size = this->_entities * sizeof(DataLoggerEntry);

  // set the buffer length
  uint32_t buf_length = 1024;
  // create a copy buffer
  byte buf[1024];

  // copy the data from flash to sd card
  for (uint32_t i = 0; i < data_size; i += buf_length) {
    // update the status led
    this->_status_leds->finalize();
    // read the data from flash memory
    this->_flash->readByteArray(i, buf, buf_length);

    // write the buffer to sd file
    uint32_t n = this->_data_file.write(buf, buf_length);
    if (n != buf_length) {
      Serial.println("fail to write data from flash memory to data-file, because mismatch of written bytes.");
      return false;
    }
  }

  // flush the bytes to file
  this->_data_file.flush();

  return true;
}
