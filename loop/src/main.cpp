#include <Wire.h>
#include <stats.h>
#include <Arduino.h>
#include <imu.h>
#include <ist8310.h>
#include <mpu6050.h>
#include <madgwick.h>
#include <status_leds.h>
#include <data_logger.h>

#include "error.h"
#include "config.h"
#include "data_log_entry.h"
#include "loop_controller.h"

// System
Stats stats;
StatusLeds leds;
StatusLedsConfig leds_config;

// IMU
IMU imu;
IST8310 ist8310;
MPU6050 mpu6050;
Madgwick madgwick;
MadgwickConfig madgwick_config;

// DataLogger
DataLogger data_logger;
DataLoggerConfig data_logger_config;

// FlightController
FlightComputer flight_computer;
FlightComputerConfig flight_computer_config;

// Loop
LoopController loop_controller;

void setup_status_leds()
{
    leds_config.red_pin = RED_LED_PIN;
    leds_config.green_pin = GREEN_LED_PIN;
    leds_config.redirect_error_2_green = false;

    leds.setup(&leds_config, &Serial);

    leds.off_red();
    leds.off_green();
    leds.singal_green(500);
}

bool setup_imu()
{
    bool success = ist8310.setup(&Wire, &Serial, &leds);
    if (!success)
    {
        Serial.println("fail to setup ist8310");
        leds.error(ERROR_IST_8310);
    }
    ist8310.set_flip_x_y(true);

    success = mpu6050.setup(&Wire, &Serial, &leds);
    if (!success)
    {
        Serial.println("fail to setup mpu6050");
        leds.error(ERROR_MPU_6050);
    }

    // set the acceleration offset for mpu6050
    Vec3f offset(ACCELERATION_X_OFFSET, ACCELERATION_Y_OFFSET, ACCELERATION_Z_OFFSET);
    mpu6050.set_acceleration_offset(offset);

    madgwick_config.madgwick_ki = MADGWICK_KI;
    madgwick_config.madgwick_kp = MADGWICK_KP;
    success = madgwick.setup(&madgwick_config, &stats);
    if (!success)
    {
        Serial.println("fail to setup madgwick");
        leds.error(ERROR_MADGWICK);
    }

    success = imu.setup(&mpu6050, &mpu6050, &ist8310, &madgwick, &Serial);
    if (!success)
    {
        Serial.println("fail to setup imu");
        leds.error(ERROR_IMU);
    }

    // set the rotation
    Quaternion rotation;
    rotation.set_euler(IMU_X_ROTATION, IMU_Y_ROTATION, IMU_Z_ROTATION);
    imu.set_rotation(rotation);

    return true;
}

bool setup_data_logger()
{
    data_logger_config.force_full_flush_erase = false;
    data_logger_config.type = DATA_LOGGER_LOOP_TYPE;
    data_logger_config.flash_cs = DATA_LOGGER_FLUSH_CS;
    data_logger_config.use_flash = DATA_LOGGER_USE_FLASH;
    data_logger_config.sd_card_cs = DATA_LOGGER_SD_CARD_CS;
    // get the size of the data logger entry
    DataLoggerEntry entry;
    data_logger_config.entry_size = sizeof(entry);

    Serial.print("size of the entry [");
    Serial.print(data_logger_config.entry_size);
    Serial.println(" ]");

    // set up the data logegr
    bool success = data_logger.setup(&data_logger_config, &leds, &Serial);
    if (!success)
    {
        Serial.println("fail to setup data logger");
        leds.error(ERROR_DATA_LOGGER);
    }

    return true;
}

bool setup_flight_computer()
{
    flight_computer_config.flight_terminate_timeout = (10 * 1000);

    flight_computer_config.launch_acceleration_threshold = 0.75;

    flight_computer_config.lift_off_velocity_threshold = 0.5;

    flight_computer_config.meco_acceleration_threshold = 0.5;

    flight_computer_config.apogee_velocity_threshold = 0.1;

    flight_computer_config.landed_orientation_count = 1000;
    flight_computer_config.landed_orientation_threshold = 0.5;
    flight_computer_config.landed_acceleration_threshold = 0.5;
    flight_computer_config.landed_change_detect_timeout = (2 * 1000);

    bool success = flight_computer.setup(&flight_computer_config, &loop_controller, &imu, &stats, &Serial);
    if (!success)
    {
        return false;
    }

    return true;
}

void setup()
{
    Serial.begin(115200);

    Wire.begin();
    Wire.setClock(400000);

    SPI.begin();

    setup_status_leds();

    leds.sleep(1000);

    Serial.println("Starting...");

    // ######################

    bool success = stats.setup();
    if (!success)
    {
        Serial.println("fail to setup stats");
        leds.error(ERROR_STATS);
    }

    // ######################

    success = setup_imu();
    if (!success)
    {
        return;
    }

    // ######################

    success = setup_data_logger();
    if (!success)
    {
        return;
    }

    // ######################
    success = setup_flight_computer();
    if (!success)
    {
        Serial.println("fail to setup flight computer");
        leds.error(ERROR_FLIGHT_COMPUTER);
        return;
    }

    // ######################
    success = loop_controller.setup(&imu, &flight_computer, &data_logger, &leds, &stats, &Serial);
    if (!success)
    {
        Serial.println("fail to setup loop controller");
        leds.error(ERROR_LOOP_CONTROLLER);
        return;
    }

    Serial.println("successful completed setup");

    Serial.flush();
    // lets chill
    leds.sleep(1000);
    // set green flushing off
    leds.stop_green();
    // turn green on
    leds.on_green();
}

void loop()
{
    stats.update();
    leds.update();

    bool success = mpu6050.update();
    if (!success)
    {
        Serial.println("fail to update mpu6050");
        leds.error(ERROR_MPU_6050);
    }

    success = ist8310.update();
    if (!success)
    {
        Serial.println("fail to update ist8310");
        leds.error(ERROR_IST_8310);
    }

    success = imu.update();
    if (!success)
    {
        Serial.println("fail to update imu");
        leds.error(ERROR_IMU);
    }
    flight_computer.update();

    success = loop_controller.update();
    if (!success)
    {
        Serial.println("fail to update loop controller");
        leds.error(ERROR_LOOP_CONTROLLER);
    }
}