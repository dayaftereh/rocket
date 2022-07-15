#include <Wire.h>
#include <stats.h>
#include <Arduino.h>
#include <imu.h>
#include <ist8310.h>
#include <mpu6050.h>
#include <madgwick.h>
#include <status_leds.h>

#include "error.h"
#include "config.h"

// System
Stats stats;
StatusLeds leds;
StatusLedsConfig leds_config;

// IMU
IMU imu;
IST8310 ist8310;
MPU6050 mpu6050;
Madgwick madgwick;
MadgwickConfig madgwickConfig;

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

    madgwickConfig.madgwick_ki = MADGWICK_KI;
    madgwickConfig.madgwick_kp = MADGWICK_KP;
    success = madgwick.setup(&madgwickConfig, &stats);
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

void setup()
{
    Serial.begin(115200);

    Wire.begin();
    Wire.setClock(400000);

    setup_status_leds();

    leds.sleep(1000);

    Serial.println("Starting...");

    bool success = stats.setup();
    if (!success)
    {
        Serial.println("fail to setup stats");
        leds.error(ERROR_STATS);
    }

    success = setup_imu();
    if (!success)
    {
        return;
    }

    // set green flushing off
    leds.stop_green();
    // turn green on
    leds.on_green();

    Serial.flush();
}

void output_imu_data()
{
    // output the orientation
    Quaternion *orientation = imu.get_orientation();
    Vec3f euler = orientation->get_euler().scale_scalar(RAD_TO_DEG);
    Serial.print(euler.x);
    Serial.print(" ");
    Serial.print(euler.y);
    Serial.print(" ");
    Serial.print(euler.z);
    Serial.print(" ");

     // acceleration
    Vec3f *acceleration = imu.get_acceleration_filtered();
    Serial.print(acceleration->x);
    Serial.print(" ");
    Serial.print(acceleration->y);
    Serial.print(" ");
    Serial.print(acceleration->z);
    Serial.print(" ");

    // world acceleration
    Vec3f *world_acceleration = imu.get_world_acceleration_filtered();
    Serial.print(world_acceleration->x);
    Serial.print(" ");
    Serial.print(world_acceleration->y);
    Serial.print(" ");
    Serial.print(world_acceleration->z);
    Serial.print(" ");

    // zerored acceleration
    Vec3f *zeroed_acceleration = imu.get_zeroed_acceleration_filtered();
    Serial.print(zeroed_acceleration->x);
    Serial.print(" ");
    Serial.print(zeroed_acceleration->y);
    Serial.print(" ");
    Serial.print(zeroed_acceleration->z);
    Serial.print(" ");
    // the length of zerored acceleration
    Serial.println(zeroed_acceleration->length());
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

    output_imu_data();
}