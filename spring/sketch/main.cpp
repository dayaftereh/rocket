#include <imu.h>
#include <stats.h>
#include <mpu6050.h>
#include <qmc5883l.h>
#include <status_leds.h>

#include "networking.h"
#include "error_code.h"
#include "data_logger.h"
#include "remote_server.h"
#include "config_manager.h"
#include "flight_observer.h"
#include "altitude_manager.h"
#include "parachute_manager.h"
#include "voltage_measurement.h"

IMU imu;
Stats stats;
MPU6050 mpu6050;
QMC5883L qmc5883L;
Madgwick madgwick;
StatusLeds statusLeds;
DataLogger dataLogger;
Networking networking;
RemoteServer remoteServer;
StatusLedsConfig ledsConfig;
ConfigManager configManager;
FlightObserver flightObserver;
AltitudeManager altitudeManager;
ParachuteManager parachuteManager;
VoltageMeasurement voltageMeasurement;

void start_leds()
{

  ledsConfig.red_pin = -1;
  ledsConfig.green_pin = STATUS_LED_1_PIN;
  ledsConfig.redirect_error_2_green = true;

  // setup the status leds
  statusLeds.setup(&ledsConfig, &Serial);
  // turn of red
  statusLeds.off_red();
  // turn of green
  statusLeds.off_green();

  statusLeds.singal_green(500);
}

bool setup_imu(Config *config)
{
  bool success = mpu6050.setup(&Wire, &Serial, &statusLeds);
  if (!success)
  {
    Serial.println("fail to setup mpu6050");
    statusLeds.error(ERROR_MPU_6050);
  }

  // set the custom mpu6050 offset
  Vec3f offset(-0.7, 0, -2.8);
  mpu6050.set_acceleration_offset(offset);

  success = qmc5883L.setup(&Wire, &Serial, &statusLeds);
  if (!success)
  {
    Serial.println("fail to setup qmc5883L");
    statusLeds.error(ERROR_QMC_5883L);
  }

  success = madgwick.setup(config, &stats);
  if (!success)
  {
    Serial.println("fail to setup madgwick");
    statusLeds.error(ERROR_MADGWICK);
  }

  // IMU
  success = imu.setup(&mpu6050, &mpu6050, &qmc5883L, &madgwick, &Serial);
  if (!success)
  {
    Serial.println("fail to setup inertial measurement unit (IMU)");
    statusLeds.error(ERROR_IMU);
  }

  // setup the imu rotation
  Quaternion rotation;
  rotation.set_euler(DEG_TO_RAD * config->rotation_x, DEG_TO_RAD * config->rotation_y, DEG_TO_RAD * config->rotation_z);
  imu.set_rotation(rotation);

  return true;
}

void setup()
{
  Serial.begin(SERIAL_BAUD_RATE);

  // start the wire
  Wire.begin();
  Wire.setClock(400000);

  // start the status leds
  start_leds();
  // delay the startup
  statusLeds.sleep(1000);
  // update the status leds
  statusLeds.update();

  // Networking
  bool success = networking.setup();
  if (!success)
  {
    Serial.println("fail to setup networking");
    statusLeds.error(ERROR_NETWORKING);
  }

  // ConfigManager
  success = configManager.setup();
  if (!success)
  {
    Serial.println("fail to setup config manager");
    statusLeds.error(ERROR_CONFIG_MANAGER);
  }

  // get the loaded config
  Config *config = configManager.get_config();

  // update the status leds
  statusLeds.update();

  // ParachuteManager
  success = parachuteManager.setup(config, &statusLeds);
  if (!success)
  {
    Serial.println("fail to setup parachute manager");
    statusLeds.error(ERROR_PARACHUTE_MANAGER);
  }

  // update the status leds
  statusLeds.update();

  // Stats
  success = stats.setup();
  if (!success)
  {
    Serial.println("fail to setup stats");
    statusLeds.error(ERROR_STATS);
  }

  // update the status leds
  statusLeds.update();

  // AltitudeManager
  success = altitudeManager.setup(&statusLeds);
  if (!success)
  {
    Serial.println("fail to setup altitude manager");
    statusLeds.error(ERROR_ALTITUDE_MANAGER);
  }

  // update the status leds
  statusLeds.update();

  // update the status leds
  statusLeds.update();

  // VoltageMeasurement
  success = voltageMeasurement.setup(config);
  if (!success)
  {
    Serial.println("fail to setup voltage measurement");
    statusLeds.error(ERROR_VOLTAGE_MEASUREMENT);
  }

  // IMU
  success = setup_imu(config);
  if (!success)
  {
    Serial.println("fail to setup imu");
    statusLeds.error(ERROR_IMU);
  }

  // update the status leds
  statusLeds.update();

  // DataLogger
  success = dataLogger.setup(&stats, &statusLeds, &altitudeManager, &voltageMeasurement, &imu, &parachuteManager, &flightObserver);
  if (!success)
  {
    Serial.println("fail to setup data logger");
    statusLeds.error(ERROR_DATA_LOGGER);
  }

  // update the status leds
  statusLeds.update();

  // RemoteServer
  success = remoteServer.setup(&configManager, &dataLogger, &parachuteManager, &flightObserver, &imu);
  if (!success)
  {
    Serial.println("fail to setup remote server");
    statusLeds.error(ERROR_REMOTE_SERVER);
  }

  // update the status leds
  statusLeds.update();

  // FlightObserver
  success = flightObserver.setup(config, &statusLeds, &imu, &altitudeManager, &parachuteManager, &stats);
  if (!success)
  {
    Serial.println("fail to setup flight observer");
    statusLeds.error(ERROR_FLIGHT_OBSERVER);
  }

  Serial.println("initialization completed, ready for starting");
  // stop the signal
  statusLeds.stop_green();
  // turn on green
  statusLeds.on_green();

  // write all serial data
  Serial.flush();
}

void loop()
{
  // always update stats first
  float delta = stats.update();

  qmc5883L.update();
  // update other components
  bool success = mpu6050.update();
  if (!success)
  {
    Serial.println("fail to update mpu6050");
    statusLeds.error(ERROR_FLIGHT_OBSERVER);
  }

  success = imu.update();
  if (!success)
  {
    Serial.println("fail to update imu");
    statusLeds.error(ERROR_IMU);
  }

  altitudeManager.update();

  dataLogger.update();
  remoteServer.update();
  parachuteManager.update();
  voltageMeasurement.update();

  // always update flight observer as last
  flightObserver.update();
}
