#ifndef _ALTITUDE_MANAGER_H
#define _ALTITUDE_MANAGER_H

#include <Adafruit_BMP280.h>

#include "config.h"

class AltitudeManager
{
  public:
    AltitudeManager();

    bool setup();
    void update();

    void zero();
    float get_altitude();
    float get_altitude_delta();

  private:
    float _altitude;
    float _zero_altitude;
    Adafruit_BMP280 *_bmp280;
};

#endif // _ALTITUDE_MANAGER_H
