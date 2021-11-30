#ifndef _ALTITUDE_MANAGER_H
#define _ALTITUDE_MANAGER_H

#include <Adafruit_BMP280.h>

#include "config.h"
#include "status_leds.h"

class AltitudeManager
{
  public:
    AltitudeManager();

    bool setup(StatusLeds *status_leds);
    void update();

    void zero();
    float get_altitude();
    float get_altitude_delta();

  private:

    bool zero_altitude();

    float _altitude;
    float _zero_altitude;

    Adafruit_BMP280 _bmp280;
    StatusLeds *_status_leds;
};

#endif // _ALTITUDE_MANAGER_H
