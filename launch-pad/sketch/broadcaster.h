#ifndef _BORADCASTER_H
#define _BORADCASTER_H

#include <Arduino.h>
#include <ArduinoJson.h>

#include "valve.h"
#include "config.h"
#include "http_server.h"
#include "analog_reader.h"

class Broadcaster
{
  public:
    Broadcaster();

    bool setup(HTTPServer *server, Valve *valve, AnalogReader *analog_reader);

    void update();

  private:

    void reset(int16_t now);
    void broadcast();
    void update_analog();

    int16_t _timer;
    int16_t _counter;

    float _sum_voltage;
    float _sum_pressure;

    Valve * _valve;
    HTTPServer * _server;
    AnalogReader * _analog_reader;
};


#endif // _BORADCASTER_H
