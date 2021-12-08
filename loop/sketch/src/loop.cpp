#include "loop.h"

Loop::Loop()
{
}

void Loop::setup()
{
    Serial.begin(SERIAL_BAUD_RATE);

    // start the wire
    Wire.begin();
    Wire.setClock(400000);

    // start the leds
    this->_leds.setup();

    // delay the startup
    this->_leds.delay(500);

    // start the init flashing
    this->_leds.green_blink(1000);
    this->_leds.red_off();

    // setup the error manager
    this->_error_manager.setup(&this->_leds);

    // Networking
    bool success = this->_networking.setup(&this->_leds);
    if (!success)
    {
        Serial.println("fail to setup networking");
        this->_error_manager.error(ERROR_NETWORKING);
    }

    // ConfigManager
    success = this->_config_manager.setup();
    if (!success)
    {
        Serial.println("fail to setup config manager");
        this->_error_manager.error(ERROR_CONFIG_MANAGER);
    }

    // get the loaded config
    Config *config = this->_config_manager.get_config();

    // ParachuteManager
    success = this->_parachute_manager.setup(config, &this->_leds);
    if (!success)
    {
        Serial.println("fail to setup parachute manager");
        this->_error_manager.error(ERROR_PARACHUTE_MANAGER);
    }

    // Stats
    success = this->_stats.setup();
    if (!success)
    {
        Serial.println("fail to setup stats");
        this->_error_manager.error(ERROR_STATS);
    }

    // AltitudeManager
    success = this->_altitude_manager.setup(&this->_leds);
    if (!success)
    {
        Serial.println("fail to setup altitude manager");
        this->_error_manager.error(ERROR_ALTITUDE_MANAGER);
    }

    // IMU
    success = this->_imu.setup(config, &this->_stats, &this->_leds);
    if (!success)
    {
        Serial.println("fail to setup inertial measurement unit (IMU)");
        this->_error_manager.error(ERROR_IMU);
    }

    // TVC
    success = this->_tvc.setup(config, &this->_leds, &this->_imu);
    if (!success)
    {
        Serial.println("fail to setup thrust vector control (TVC)");
        this->_error_manager.error(ERROR_TVC);
    }

    // TriggerManager
    success = this->_trigger_manager.setup(&this->_leds);
    if (!success)
    {
        Serial.println("fail to setup trigger manager");
        this->_error_manager.error(ERROR_TRIGGER_MANAGER);
    }

    // VoltageMeasurement
    success = this->_voltage_measurement.setup(config);
    if (!success)
    {
        Serial.println("fail to setup voltage measurement");
        this->_error_manager.error(ERROR_VOLTAGE_MEASUREMENT);
    }

    // DataLogger
    success = this->_data_logger.setup(&this->_stats, &this->_leds, &this->_altitude_manager, &this->_voltage_measurement, &this->_imu, &this->_parachute_manager, &this->_flight_observer);
    if (!success)
    {
        Serial.println("fail to setup data logger");
        this->_error_manager.error(ERROR_DATA_LOGGER);
    }

    // RemoteServer
    success = this->_remote_server.setup(&this->_config_manager, &this->_leds, &this->_data_logger, &this->_parachute_manager, &this->_flight_observer);
    if (!success)
    {
        Serial.println("fail to setup remote server");
        this->_error_manager.error(ERROR_REMOTE_SERVER);
    }

    // FlightObserver
    success = this->_flight_observer.setup(config, &this->_leds, &this->_imu, &this->_tvc, &this->_altitude_manager, &this->_parachute_manager, &this->_stats);
    if (!success)
    {
        Serial.println("fail to setup flight observer");
        this->_error_manager.error(ERROR_FLIGHT_OBSERVER);
    }

    Serial.println("initialization completed, ready for starting");

    // set the status to ready
    this->_leds.green_on();
    // write all serial data
    Serial.flush();
}

void Loop::update()
{
    // always update stats first
    float delta = this->_stats.update();

    // update other components
    this->_imu.update();
    this->_tvc.update();
    this->_data_logger.update();
    this->_remote_server.update();
    this->_trigger_manager.update();
    this->_altitude_manager.update();
    this->_parachute_manager.update();
    this->_voltage_measurement.update();

    // always update flight observer as last
    this->_flight_observer.update();
}