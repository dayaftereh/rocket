#include <mpu6050.h>
#include <Arduino.h>
#include <IST8310.h>
#include <status_leds.h>
#include <madgwick.h>
#include <stats.h>

Stats stats;
MPU6050 mpu;
IST8310 ist8310;
StatusLeds leds;
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

    success = ist8310.set_average(IST8310_4_AVERAGE_Y, IST8310_4_AVERAGE_X_Z);
    if (!success)
    {
        Serial.println("fail to set average");
        leds.error(2);
    }

    success = mpu.setup(&Wire, &Serial, &leds);
    if (!success)
    {
        Serial.println("Fail to setup mpu6050");
        leds.error(2);
    }

    success = stats.setup();
    if (!success)
    {
        Serial.println("Fail to setup stats");
        leds.error(3);
    }

    success = madgwick.setup(1.0, 1.0, &stats);
    if (!success)
    {
        Serial.println("Fail to setup madgwick");
        leds.error(4);
    }

    Serial.println("Success setup");
    Serial.flush();
}

void loop()
{
    float delta = stats.update();

    bool success = mpu.update();
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

    Vec3f *gyroscope = mpu.get_gyroscope();
    Vec3f *acceleration = mpu.get_acceleration();
    Vec3f *magnetometer = ist8310.get_magnetometer();

    if (magnetometer->length() < 0.0001)
    {
        return;
    }

    Serial.print(delta);
    Serial.print(" ");
    Serial.print(acceleration->x);
    Serial.print(" ");
    Serial.print(acceleration->y);
    Serial.print(" ");
    Serial.print(acceleration->z);
    Serial.print(" ");
    Serial.print(gyroscope->x);
    Serial.print(" ");
    Serial.print(gyroscope->y);
    Serial.print(" ");
    Serial.print(gyroscope->z);
    Serial.print(" ");
    Serial.print(magnetometer->x);
    Serial.print(" ");
    Serial.print(magnetometer->y);
    Serial.print(" ");
    Serial.print(magnetometer->z);
    Serial.print(" ");

    Vec3f gyro_rad = gyroscope->scale_scalar(DEG_TO_RAD);

    madgwick.update(
        gyro_rad.x, gyro_rad.y, gyro_rad.z,
        acceleration->x, acceleration->y, acceleration->z,
        magnetometer->x, magnetometer->y, magnetometer->z);

    Quaternion *q = madgwick.get_quaternion();
    Vec3f euler = q->get_euler().scale_scalar(RAD_TO_DEG);

    Serial.print(euler.x);
    Serial.print(" ");
    Serial.print(euler.y);
    Serial.print(" ");
    Serial.println(euler.z);
}