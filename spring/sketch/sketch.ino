#include "data_logger.h"
#include "status_leds.h"
#include "error_manager.h"
#include "config_manager.h"
#include "motion_manager.h"
#include "altitude_manager.h"
#include "voltage_measurement.h"

StatusLeds statusLeds;
DataLogger dataLogger;
ErrorManager errorManager;
ConfigManager configManager;
MotionManager motionManager;
AltitudeManager altitudeManager;
VoltageMeasurement voltageMeasurement;

void setup() {
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

  bool success = configManager.setup();
  if (!success) {
    Serial.println("fail to setup config manager");
    errorManager.error(ERROR_CONFIG_MANAGER);
  }

  // get the loaded config
  Config *config = configManager.get_config();

  // update the status progress
  statusLeds.progress();

  success = altitudeManager.setup();
  if (!success) {
    Serial.println("fail to setup altitude manager");
    errorManager.error(ERROR_ALTITUDE_MANAGER);
  }

  // update the status progress
  statusLeds.progress();

  success = motionManager.setup();
  if (!success) {
    Serial.println("fail to setup motion manager");
    errorManager.error(ERROR_MOTION_MANAGER);
  }

  // update the status progress
  statusLeds.progress();

  success = dataLogger.setup(&statusLeds);
  if (!success) {
    Serial.println("fail to setup data logger");
    errorManager.error(ERROR_DATA_LOGGER);
  }

  // update the status progress
  statusLeds.progress();

  success = voltageMeasurement.setup(config);
  if (!success) {
    Serial.println("fail to setup voltage measurement");
    errorManager.error(ERROR_VOLTAGE_MEASUREMENT);
  }

  // set the status to ready
  statusLeds.ready();
  // write all serial data
  Serial.flush();
}

void loop() {
  motionManager.update();
  altitudeManager.update();
  voltageMeasurement.update();
}
