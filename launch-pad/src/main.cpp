#include <Arduino.h>
#include <status_leds.h>

#include "error.h"
#include "config.h"
#include "config_manager.h"
#include "launch_computer.h"
#include "launch_pad_server.h"

StatusLedsConfig leds_config;

StatusLeds leds;
ConfigManager config_manager;
LaunchComputer launch_computer;
LaunchPadServer launch_pad_server;

void setup()
{
    // start the serial
    Serial.begin(SERIAL_BAUD_RATE);

    // setup the pin config
    leds_config.red_pin = RED_LED_PIN;
    leds_config.green_pin = GREEN_LED_PIN;
    // disable led redirect
    leds_config.redirect_error_2_green = false;
    // setup the leds
    leds.setup(&leds_config, &Serial);

    // flash with the green led to signal startup
    leds.singal_green(1000);

    // wait a short time
    leds.sleep(500);

    // setup the config manager
    bool success = config_manager.setup(&Serial);
    if (!success)
    {
        Serial.println("fail to setup config-manager");
        leds.error(ERROR_CONFIG_MANAGER);
        return;
    }

    // get the current config
    Config *config = config_manager.get_config();

    // setup the launch server
    success = launch_computer.setup(config, &leds);
    if (!success)
    {
        Serial.println("fail to setup launch computer");
        leds.error(ERROR_LAUNCH_COMPUTER);
        return;
    }

    // setup the server
    success = launch_pad_server.setup(&config_manager, &launch_computer, &leds, &Serial);
    if (!success)
    {
        Serial.println("fail to setup config-manager");
        leds.error(ERROR_SERVER);
        return;
    }

    // wait a short time
    leds.sleep(500);

    // write started message
    Serial.println("launch-pad successful started");
    Serial.flush();
    // singal launch-pad started
    leds.stop_green();
    leds.on_green();
}

void loop()
{
    leds.update();
    launch_computer.update();
    launch_pad_server.update();
}