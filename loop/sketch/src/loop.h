#ifndef _LOOP_H
#define _LOOP_H

class Loop
{
public:
    Loop();

    void setup();
    void update();

private:

    IMU imu;
    Stats stats;
    StatusLeds statusLeds;
    DataLogger dataLogger;
    Networking networking;
    RemoteServer remoteServer;
    ErrorManager errorManager;
    ConfigManager configManager;
    FlightObserver flightObserver;
    AltitudeManager altitudeManager;
    ParachuteManager parachuteManager;
    VoltageMeasurement voltageMeasurement;
};

#endif // _LOOP_H