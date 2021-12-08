#ifndef _ALTITUDE_MANAGER_H
#define _ALTITUDE_MANAGER_H

#include <Adafruit_BMP280.h>

#include "../utils/leds.h"
#include "../config/config.h"

class AltitudeManager
{
public:
  AltitudeManager();

  bool setup(LEDs *leds);
  void update();

  void zero();
  float get_altitude();
  float get_altitude_delta();

private:
  bool zero_altitude();

  float _altitude;
  float _zero_altitude;

  LEDs *_leds;
  Adafruit_BMP280 _bmp280;
};

#endif // _ALTITUDE_MANAGER_H
