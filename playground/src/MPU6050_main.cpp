#include <vec3f.h>
#include <Arduino.h>
#include <Adafruit_MPU6050.h>

Adafruit_MPU6050 mpu;

void error()
{
    Serial.flush();
    while (true)
    {
        delay(10);
    }
}

void setup()
{
    Serial.begin(115200);
    while (!Serial)
        ;

    Wire.begin();
    Wire.setClock(400000);

    Serial.println("Starting...");
    Serial.flush();

    if (!mpu.begin())
    {
        Serial.println("Sensor init failed");
        error();
    }

    Serial.println("Setup successful");
    Serial.flush();
}

uint32_t sum = 0;
int counter = 1000;

void loop()
{
    counter++;
    uint32_t start = millis();

    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);

    Serial.print("Accelerometer ");
    Serial.print("X: ");
    Serial.print(a.acceleration.x, 1);
    Serial.print(" m/s^2, ");
    Serial.print("Y: ");
    Serial.print(a.acceleration.y, 1);
    Serial.print(" m/s^2, ");
    Serial.print("Z: ");
    Serial.print(a.acceleration.z, 1);
    Serial.println(" m/s^2");

    Serial.print("Gyroscope ");
    Serial.print("X: ");
    Serial.print(g.gyro.x, 1);
    Serial.print(" rps, ");
    Serial.print("Y: ");
    Serial.print(g.gyro.y, 1);
    Serial.print(" rps, ");
    Serial.print("Z: ");
    Serial.print(g.gyro.z, 1);
    Serial.println(" rps");
    /*bool success = mpu6050.update();
    sum += millis() - start;

    if (!success)
    {
        Serial.println("Error update");
        error();
    }

    Vec3f *gyroscope = mpu6050.get_raw_gyroscope();
    Vec3f *acceleration = mpu6050.get_raw_acceleration();

    if (counter > 1000)
    {
        float ms = float(sum) / float(counter);
        sum = 0;
        counter = 0;

        Serial.print(", time: ");
        Serial.println(ms, 2);
    }*/
}