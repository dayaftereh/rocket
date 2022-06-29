#include <mpu6050.h>
#include <Arduino.h>
#include <status_leds.h>

void error()
{
    Serial.flush();
    while (true)
    {
        delay(10);
    }
}

MPU6050 mpu;
StatusLeds leds;

void setup()
{
    Serial.begin(115200);
    while (!Serial)
        ;

    Wire.begin();
    Wire.setClock(400000);

    Serial.println("Starting...");
    Serial.flush();

    bool success = mpu.setup(&Wire, &Serial, &leds);
    if (!success)
    {
        Serial.println("Fail to setup mpu6050");
        error();
    }
}

void loop()
{
    bool success = mpu.update();
    if (!success)
    {
        Serial.println("Fail to update mpu6050");
        error();
    }

    Vec3f *gyroscope = mpu.get_gyroscope();
    Vec3f *acceleration = mpu.get_acceleration();

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
    Serial.println(gyroscope->z);
}