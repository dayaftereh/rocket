#include <mpu6050.h>
#include <Arduino.h>
#include <IST8310.h>
#include <status_leds.h>
#include <madgwick.h>
#include <stats.h>
#include <imu.h>

IMU imu;
Stats stats;
MPU6050 mpu6050;
StatusLeds leds;
IST8310 ist8310;
Madgwick madgwick;

void setup()
{
    Serial.begin(115200);
    while (!Serial)
        ;

    Wire.begin();
    Wire.setClock(400000);

    bool success = ist8310.setup(&Wire, &Serial, &leds);
    if (!success)
    {
        Serial.println("fail to setup ist8310");
        leds.error(1);
    }

    ist8310.set_flip_x_y(true);

    success = ist8310.set_average(IST8310_4_AVERAGE_Y, IST8310_4_AVERAGE_X_Z);
    if (!success)
    {
        Serial.println("fail to set average");
        leds.error(2);
    }

    success = mpu6050.setup(&Wire, &Serial, &leds);
    if (!success)
    {
        Serial.println("Fail to setup mpu6050");
        leds.error(2);
    }

    Vec3f offset(-0.7, 0, -2.8);
    mpu6050.set_acceleration_offset(offset);

    success = stats.setup();
    if (!success)
    {
        Serial.println("Fail to setup stats");
        leds.error(3);
    }

    success = madgwick.setup(0.0, 10.0, &stats);
    if (!success)
    {
        Serial.println("Fail to setup madgwick");
        leds.error(4);
    }

    success = imu.setup(&mpu6050, &mpu6050, &ist8310, &madgwick, &Serial);
    if (!success)
    {
        Serial.println("Fail to setup imu");
        leds.error(6);
    }

    Quaternion rotation;
    rotation.set_euler(DEG_TO_RAD * -90, 0.0, 0.0);
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

    success = ist8310.update();
    if (!success)
    {
        Serial.println("fail to update ist8310");
        leds.error(11);
    }

    success = imu.update();
    if (!success)
    {
        Serial.println("fail to update imu");
        leds.error(12);
    }

    /*Quaternion *orientation = imu.get_orientation();

    Vec3f euler = orientation->get_euler().scale_scalar(RAD_TO_DEG);
    Serial.print(euler.x);
    Serial.print(" ");
    Serial.print(euler.y);
    Serial.print(" ");
    Serial.print(euler.z);
    Serial.print(" ");*/

    Vec3f *acceleration = imu.get_world_acceleration();

    
    Serial.print(acceleration->x);
    Serial.print(" ");
    Serial.print(acceleration->y);
    Serial.print(" ");
    Serial.print(acceleration->z);
    Serial.print(" ");

    Vec3f *acceleration_filtered = imu.get_world_acceleration_filtered();

    Serial.print(acceleration_filtered->x);
    Serial.print(" ");
    Serial.print(acceleration_filtered->y);
    Serial.print(" ");
    Serial.println(acceleration_filtered->z);
}