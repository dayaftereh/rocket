#include "altitude_manager.h"

AltitudeManager::AltitudeManager()
{
}

bool AltitudeManager::setup(LEDs *leds)
{
  this->_leds = leds;

  // try first address
  bool success = this->_bmp280.begin(0x77);
  if (!success)
  {
    // try second address
    success = this->_bmp280.begin(0x76);
  }

  if (!success)
  {
    Serial.println("Could not find a valid BMP280 sensor, check wiring or try a different address!");
    return false;
  }

  /* Default settings from datasheet. */
  this->_bmp280.setSampling(Adafruit_BMP280::MODE_NORMAL,   /* Operating Mode. */
                            Adafruit_BMP280::SAMPLING_X4,   /* Temp. oversampling */
                            Adafruit_BMP280::SAMPLING_X16,  /* Pressure oversampling */
                            Adafruit_BMP280::FILTER_X4,     /* Filtering. */
                            Adafruit_BMP280::STANDBY_MS_1); /* Standby time. */

  uint8_t status = this->_bmp280.getStatus();
  uint8_t sensorID = this->_bmp280.sensorID();

  // output info about bmp280 sensor
  Serial.print("Connected with BMP280 [ status:");
  Serial.print(status);
  Serial.print(" id: ");
  Serial.print(sensorID);
  Serial.println(" ]");

  // zero the altitude level
  success = this->zero_altitude();
  if (!success)
  {
    Serial.println("unable to zero altitude");
    return false;
  }

  return true;
}

void AltitudeManager::zero()
{
  this->_zero_altitude = this->_altitude;
}

float AltitudeManager::get_altitude()
{
  return this->_altitude;
}

float AltitudeManager::get_altitude_delta()
{
  return (this->_altitude - this->_zero_altitude);
}

void AltitudeManager::update()
{
  // read the altitude
  this->_altitude = this->_bmp280.readAltitude();
}

bool AltitudeManager::zero_altitude()
{
  unsigned long elapsed = 0;
  unsigned long start = millis();

  // warm the bmp280 up
  Serial.println("warming up the BMP280 ... ");
  while (elapsed < ALTITUDE_MANAGER_WARM_UP_TIMEOUT)
  {
    elapsed = millis() - start;
    // read the altitude
    this->_bmp280.readAltitude();

    // delay for the next reading
    this->_leds->delay(2);
  }

  // try to find zero level
  Serial.println("zeroing the altitude manager ... ");
  float sum = 0.0;
  for (int i = 0; i < ALTITUDE_MANAGER_ZERO_READINGS; i++)
  {
    sum += this->_bmp280.readAltitude();

    // delay for the next reading
    this->_leds->delay(2);
  }

  this->_zero_altitude = sum / ((float)ALTITUDE_MANAGER_ZERO_READINGS);

  return true;
}
