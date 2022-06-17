# 1 "C:\\Users\\LLO\\AppData\\Local\\Temp\\tmpmddvip2m"
#include <Arduino.h>
# 1 "C:/ASH/Workspace/Projects/rocket/spring/sketch/sketch.ino"
#include "imu.h"
#include "stats.h"
#include "networking.h"
#include "data_logger.h"
#include "status_leds.h"
#include "remote_server.h"
#include "error_manager.h"
#include "config_manager.h"
#include "flight_observer.h"
#include "altitude_manager.h"
#include "parachute_manager.h"
#include "voltage_measurement.h"

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
void setup();
void loop();
#line 27 "C:/ASH/Workspace/Projects/rocket/spring/sketch/sketch.ino"
void setup()
{
  Serial.begin(SERIAL_BAUD_RATE);


  Wire.begin();
  Wire.setClock(400000);


  delay(500);


  statusLeds.setup();


  errorManager.setup(&statusLeds);

  statusLeds.progress();


  bool success = networking.setup();
  if (!success)
  {
    Serial.println("fail to setup networking");
    errorManager.error(ERROR_NETWORKING);
  }


  success = configManager.setup();
  if (!success)
  {
    Serial.println("fail to setup config manager");
    errorManager.error(ERROR_CONFIG_MANAGER);
  }


  Config *config = configManager.get_config();


  statusLeds.progress();


  success = parachuteManager.setup(config, &statusLeds);
  if (!success)
  {
    Serial.println("fail to setup parachute manager");
    errorManager.error(ERROR_PARACHUTE_MANAGER);
  }


  statusLeds.progress();


  success = stats.setup();
  if (!success)
  {
    Serial.println("fail to setup stats");
    errorManager.error(ERROR_STATS);
  }


  statusLeds.progress();


  success = altitudeManager.setup(&statusLeds);
  if (!success)
  {
    Serial.println("fail to setup altitude manager");
    errorManager.error(ERROR_ALTITUDE_MANAGER);
  }


  statusLeds.progress();


  success = imu.setup(config, &stats, &statusLeds);
  if (!success)
  {
    Serial.println("fail to setup inertial measurement unit (IMU)");
    errorManager.error(ERROR_IMU);
  }


  statusLeds.progress();


  success = voltageMeasurement.setup(config);
  if (!success)
  {
    Serial.println("fail to setup voltage measurement");
    errorManager.error(ERROR_VOLTAGE_MEASUREMENT);
  }


  statusLeds.progress();


  success = dataLogger.setup(&stats, &statusLeds, &altitudeManager, &voltageMeasurement, &imu, &parachuteManager, &flightObserver);
  if (!success)
  {
    Serial.println("fail to setup data logger");
    errorManager.error(ERROR_DATA_LOGGER);
  }


  statusLeds.progress();


  success = remoteServer.setup(&configManager, &dataLogger, &parachuteManager, &flightObserver);
  if (!success)
  {
    Serial.println("fail to setup remote server");
    errorManager.error(ERROR_REMOTE_SERVER);
  }


  statusLeds.progress();


  success = flightObserver.setup(config, &statusLeds, &imu, &altitudeManager, &parachuteManager, &stats);
  if (!success)
  {
    Serial.println("fail to setup flight observer");
    errorManager.error(ERROR_FLIGHT_OBSERVER);
  }

  Serial.println("initialization completed, ready for starting");

  statusLeds.ready();

  Serial.flush();
}

void loop()
{

  float delta = stats.update();


  imu.update();
  altitudeManager.update();

  dataLogger.update();
  remoteServer.update();
  parachuteManager.update();
  voltageMeasurement.update();


  flightObserver.update();
}