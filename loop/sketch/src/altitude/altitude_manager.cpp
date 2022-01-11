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

  // get sensor information
  sensor_t sensor;
  this->_bmp180.getSensor(&sensor);

  // output info about bmp180 sensor
  Serial.print("Connected with bmp180 [ name:");
  Serial.print(sensor.name);
  Serial.print(" version: ");
  Serial.print(sensor.version);
  Serial.print(", id: ");
  Serial.print(sensor.sensor_id);
  Serial.print(", max_value: ");
  Serial.print(sensor.max_value);
  Serial.print(" hPa, min_value: ");
  Serial.print(sensor.min_value);
  Serial.print(" hPa, resolution: ");
  Serial.print(sensor.resolution);
  Serial.println(" hPa ]");

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
  // read the next sensor event
  sensors_event_t event;
  this->_bmp180.getEvent(&event);

  // check for success
  if (!event.pressure)
  {
    return false;
  }

  // first lets get the temperature
  float temperature;
  this->_bmp180.getTemperature(&temperature);

  // calculate altitude based on the default sea level
  float seaLevelPressure = SENSORS_PRESSURE_SEALEVELHPA;
  this->_altitude = this->_bmp180.pressureToAltitude(seaLevelPressure, event.pressure);

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
