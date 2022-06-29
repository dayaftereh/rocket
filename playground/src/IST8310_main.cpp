#include <vec3f.h>
#include <Arduino.h>
#include <IST8310.h>
#include <status_leds.h>

IST8310 ist8310;
StatusLeds leds;

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

    bool success = ist8310.setup(&Wire, &Serial, &leds);
    if (!success)
    {
        Serial.println("fail to setup ist8310");
        error();
    }

    success = ist8310.set_average(IST8310_4_AVERAGE_Y, IST8310_4_AVERAGE_X_Z);
    if (!success)
    {
        Serial.println("fail to set average");
        error();
    }

    Serial.println("Success setup");
    Serial.flush();
}

uint32_t sum = 0;
int counter = 1000;

void loop()
{
    counter++;
    uint32_t start = millis();
    bool success = ist8310.update();
    sum += millis() - start;

    if (!success)
    {
        Serial.println("fail to update ist8310");
        error();
    }

    Vec3f *v = ist8310.get_raw();

    if (counter > 1000)
    {
        float ms = float(sum) / float(counter);
        sum = 0;
        counter = 0;

        float a = atan2(v->x, v->y) * 180.0 / M_PI;

        Serial.print(a, 2);
        Serial.print(" ");
        Serial.print(v->x, 2);
        Serial.print(" ");
        Serial.print(v->y, 2);
        Serial.print(" ");
        Serial.print(v->z, 2);
        Serial.print(" ");
        Serial.println(ms, 2);
    }
}