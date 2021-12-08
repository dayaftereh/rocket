#ifndef _LOOP_H
#define _LOOP_H

#include "config/config.h"

#include "tvc/tvc.h"
#include "imu/imu.h"
#include "utils/leds.h"
#include "utils/stats.h"
#include "net/networking.h"
#include "flight_observer.h"
#include "net/remote_server.h"
#include "logger/data_logger.h"
#include "utils/error_manager.h"
#include "config/config_manager.h"
#include "trigger/trigger_manager.h"
#include "altitude/altitude_manager.h"
#include "parachute/parachute_manager.h"
#include "voltage/voltage_measurement.h"

class Loop
{
public:
    Loop();

    void setup();
    void update();

private:
    TVC _tvc;
    IMU _imu;
    LEDs _leds;
    Stats _stats;
    Networking _networking;
    DataLogger _data_logger;
    RemoteServer _remote_server;
    ErrorManager _error_manager;
    ConfigManager _config_manager;
    TriggerManager _trigger_manager;
    FlightObserver _flight_observer;
    AltitudeManager _altitude_manager;
    ParachuteManager _parachute_manager;
    VoltageMeasurement _voltage_measurement;
};

#endif // _LOOP_H