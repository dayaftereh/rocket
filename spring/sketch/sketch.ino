#include "stats.h"
#include "networking.h"
#include "data_logger.h"
#include "status_leds.h"
#include "remote_server.h"
#include "error_manager.h"
#include "config_manager.h"
#include "motion_manager.h"
#include "flight_observer.h"
#include "altitude_manager.h"
#include "parachute_manager.h"
#include "voltage_measurement.h"

Stats stats;
StatusLeds statusLeds;
DataLogger dataLogger;
Networking networking;
RemoteServer remoteServer;
ErrorManager errorManager;
ConfigManager configManager;
MotionManager motionManager;
FlightObserver flightObserver;
AltitudeManager altitudeManager;
ParachuteManager parachuteManager;
VoltageMeasurement voltageMeasurement;

void setup()
{
  Serial.begin(SERIAL_BAUD_RATE);

  // start the wire
  Wire.begin();
  Wire.setClock(400000);

  // delay the startup
  delay(500);

  // setup the status leds
  statusLeds.setup();

  // setup the error manager
  errorManager.setup(&statusLeds);
  // update the status progress
  statusLeds.progress();

  // Networking
  bool success = networking.setup();
  if (!success)
  {
    Serial.println("fail to setup networking");
    errorManager.error(ERROR_NETWORKING);
  }

  // ConfigManager
  success = configManager.setup();
  if (!success)
  {
    Serial.println("fail to setup config manager");
    errorManager.error(ERROR_CONFIG_MANAGER);
  }

  // get the loaded config
  Config *config = configManager.get_config();

  // update the status progress
  statusLeds.progress();

  // ParachuteManager
  success = parachuteManager.setup(config);
  if (!success)
  {
    Serial.println("fail to setup parachute manager");
    errorManager.error(ERROR_PARACHUTE_MANAGER);
  }

  // update the status progress
  statusLeds.progress();

  // Stats
  success = stats.setup();
  if (!success)
  {
    Serial.println("fail to setup stats");
    errorManager.error(ERROR_STATS);
  }

  // update the status progress
  statusLeds.progress();

  /*// AltitudeManager
  success = altitudeManager.setup(&statusLeds);
  if (!success) {
    Serial.println("fail to setup altitude manager");
    errorManager.error(ERROR_ALTITUDE_MANAGER);
  }*/

  // update the status progress
  statusLeds.progress();

  // MotionManagernager
  success = motionManager.setup(config, &stats, &statusLeds);
  if (!success)
  {
    Serial.println("fail to setup motion manager");
    errorManager.error(ERROR_MOTION_MANAGER);
  }

  // update the status progress
  statusLeds.progress();

  // VoltageMeasurement
  success = voltageMeasurement.setup(config);
  if (!success)
  {
    Serial.println("fail to setup voltage measurement");
    errorManager.error(ERROR_VOLTAGE_MEASUREMENT);
  }

  // update the status progress
  statusLeds.progress();

  // DataLogger
  success = dataLogger.setup(&stats, &statusLeds, &altitudeManager, &voltageMeasurement, &motionManager, &parachuteManager);
  if (!success)
  {
    Serial.println("fail to setup data logger");
    errorManager.error(ERROR_DATA_LOGGER);
  }

  // update the status progress
  statusLeds.progress();

  // RemoteServer
  success = remoteServer.setup(&configManager, &dataLogger, &parachuteManager);
  if (!success)
  {
    Serial.println("fail to setup remote server");
    errorManager.error(ERROR_REMOTE_SERVER);
  }

  // update the status progress
  statusLeds.progress();

  // FlightObserver
  success = flightObserver.setup(config, &statusLeds, &motionManager, &altitudeManager, &dataLogger);
  if (!success)
  {
    Serial.println("fail to setup flight observer");
    errorManager.error(ERROR_FLIGHT_OBSERVER);
  }

  Serial.println("initialization completed, ready for starting");
  // set the status to ready
  statusLeds.ready();
  // write all serial data
  Serial.flush();
}

void loop()
{
  // always update stats first
  float delta = stats.update();

  // update other components
  dataLogger.update();
  remoteServer.update();
  motionManager.update();
  //altitudeManager.update();
  parachuteManager.update();
  voltageMeasurement.update();

  // always update flight observer as last
  flightObserver.update();
}
