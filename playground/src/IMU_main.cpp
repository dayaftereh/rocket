#include <mpu6050.h>
#include <Arduino.h>
#include <IST8310.h>
#include <status_leds.h>
#include <madgwick.h>
#include <stats.h>
#include <imu.h>
#include <qmc5883l.h>

IMU imu;
Stats stats;
MPU6050 mpu6050;
StatusLeds leds;
IST8310 ist8310;
QMC5883L qmc5883l;
Madgwick madgwick;
StatusLedsConfig ledsConfig;
MadgwickConfig madgwickConfig;

void setup()
{
    Serial.begin(115200);

    Wire.begin();
    Wire.setClock(400000);

    while (!Serial)
    {
        delay(10);
    }

    delay(1000);

    Serial.println("Starting...");

    ledsConfig.red_pin = 2;
    ledsConfig.green_pin = 4;
    ledsConfig.redirect_error_2_green = false;
    leds.setup(&ledsConfig, &Serial);

    bool success = stats.setup();
    if (!success)
    {
        Serial.println("fail to setup stats");
        leds.error(1);
    }

    success = qmc5883l.setup(&Wire, &Serial, &leds);
    if (!success)
    {
        Serial.println("fail to setup qmc5883l");
        leds.error(2);
    }

    /*success = ist8310.setup(&Wire, &Serial, &leds);
    if (!success)
    {
        Serial.println("fail to setup ist8310");
        leds.error(2);
    }

    ist8310.set_flip_x_y(true);
    success = ist8310.set_average(IST8310_4_AVERAGE_Y, IST8310_4_AVERAGE_X_Z);
    if (!success)
    {
        Serial.println("fail to set average");
        leds.error(3);
    }*/

    success = mpu6050.setup(&Wire, &Serial, &leds);
    if (!success)
    {
        Serial.println("Fail to setup mpu6050");
        leds.error(4);
    }

    Vec3f offset(0, 0, 0);
    mpu6050.set_acceleration_offset(offset);

    success = stats.setup();
    if (!success)
    {
        Serial.println("Fail to setup stats");
        leds.error(5);
    }

    madgwickConfig.madgwick_ki = 0.0;
    madgwickConfig.madgwick_kp = 5.0;
    success = madgwick.setup(&madgwickConfig, &stats);
    if (!success)
    {
        Serial.println("Fail to setup madgwick");
        leds.error(6);
    }

    success = imu.setup(&mpu6050, &mpu6050, &qmc5883l, &madgwick, &Serial);
    if (!success)
    {
        Serial.println("Fail to setup imu");
        leds.error(7);
    }

    Quaternion rotation;

    // spring  
    rotation.set_euler(DEG_TO_RAD * -84.6, DEG_TO_RAD * 2.8, DEG_TO_RAD * 0.0);
    imu.set_rotation(rotation);

    Serial.println("Success setup");
    Serial.flush();
}

void loop()
{
    float delta = stats.update();

    bool success = mpu6050.update();
    if (!success)
    {
        Serial.println("Fail to update mpu6050");
        leds.error(10);
    }

    /*success = ist8310.update();
    if (!success)
    {
        Serial.println("fail to update ist8310");
        leds.error(11);
    }*/

    qmc5883l.update();

    success = imu.update();
    if (!success)
    {
        Serial.println("fail to update imu");
        leds.error(12);
    }

    Quaternion *orientation = imu.get_orientation();

    Vec3f euler = orientation->get_euler().scale_scalar(RAD_TO_DEG);
    Serial.print(euler.x);
    Serial.print(" ");
    Serial.print(euler.y);
    Serial.print(" ");
    Serial.print(euler.z);
    Serial.print(" ");

    /*Vec3f *acceleration = imu.get_acceleration();

    Serial.print(acceleration->x);
    Serial.print(" ");
    Serial.print(acceleration->y);
    Serial.print(" ");
    Serial.print(acceleration->z);
    Serial.print(" ");*/

    Vec3f *acceleration_filtered = imu.get_world_acceleration_filtered();

    Serial.print(acceleration_filtered->x);
    Serial.print(" ");
    Serial.print(acceleration_filtered->y);
    Serial.print(" ");
    Serial.println(acceleration_filtered->z);
}