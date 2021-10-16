#include"altitude_manager.h"

AltitudeManager::AltitudeManager() {

}

bool AltitudeManager::setup() {
  this->_bmp280 = new Adafruit_BMP280();

  bool success = this->_bmp280->begin();
  if (!success) {
    Serial.println("Could not find a valid BMP280 sensor, check wiring or try a different address!");
    return false;
  }

  /* Default settings from datasheet. */
  this->_bmp280->setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                             Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                             Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                             Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                             Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */

  uint8_t status = this->_bmp280->getStatus();
  uint8_t sensorID = this->_bmp280->sensorID();

  // output info about bmp280 sensor
  Serial.print("Connected with BMP280 [ status:");
  Serial.print(status);
  Serial.print(" id: ");
  Serial.print(sensorID);
  Serial.println(" ]");

  return true;
}

void AltitudeManager::zero() {
  this->_zero_altitude = this->_altitude;
}

float AltitudeManager::get_altitude() {
  return this->_altitude;
}

float AltitudeManager::get_altitude_delta() {
  return (this->_altitude - this->_zero_altitude);
}

void AltitudeManager::update() {
  // read the altitude
  this->_altitude = this->_bmp280->readAltitude();
}
