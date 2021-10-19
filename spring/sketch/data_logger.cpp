#include "data_logger.h"

DataLogger::DataLogger() {

}

bool DataLogger::setup(StatusLeds *status_leds) {
  this->_status_leds = status_leds;

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
