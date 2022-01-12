#include "altitude_manager.h"

AltitudeManager::AltitudeManager()
{
}

bool AltitudeManager::setup(LEDs *leds)
{
  this->_leds = leds;

  // try first address
  bool success = this->_bmp180.begin();

  if (!success)
  {
    Serial.println("Could not find a valid BMP180 sensor, check wiring or try a different address!");
    return false;
  }

  // zero the altitude level
  success = this->zero_altitude();
  if (!success)
  {
    Serial.println("unable to zero altitude");
    return false;
  }

  return true;
}

bool AltitudeManager::read_altitude()
{  
  this->_altitude = this->_bmp180.readAltitude();
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
  this->read_altitude();
}

bool AltitudeManager::zero_altitude()
{
  unsigned long elapsed = 0;
  unsigned long start = millis();

  // warm the BMP180 up
  Serial.println("warming up the BMP180 ... ");
  while (elapsed < ALTITUDE_MANAGER_WARM_UP_TIMEOUT)
  {
    elapsed = millis() - start;
    // read the altitude
    bool success = this->read_altitude();
    if (!success)
    {
      return false;
    }

    // delay for the next reading
    this->_leds->sleep(2);
  }

  // try to find zero level
  Serial.println("zeroing the altitude manager ... ");
  float sum = 0.0;
  for (int i = 0; i < ALTITUDE_MANAGER_ZERO_READINGS; i++)
  {
    // read the altitude
    bool success = this->read_altitude();
    if (!success)
    {
      return false;
    }

    sum += this->_altitude;

    // delay for the next reading
    this->_leds->sleep(2);
  }

  this->_zero_altitude = sum / ((float)ALTITUDE_MANAGER_ZERO_READINGS);

  Serial.print("altitude zeroed by [ ");
  Serial.print(this->_zero_altitude);
  Serial.println(" m ]");

  return true;
}
