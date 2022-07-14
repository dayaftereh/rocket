#include <Arduino.h>
#include <status_leds.h>

StatusLeds leds;
StatusLedsConfig config;

void setup()
{
    Serial.begin(115200);

    Serial.println("Starting...");
    Serial.flush();

    config.red_pin = 2;
    config.green_pin = 4;
    config.redirect_error_2_green = false;

    leds.setup(&config, &Serial);

    leds.singal_red(1000);
    leds.singal_green(500);
}

void loop()
{
    leds.update();
}