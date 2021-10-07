#include "valve.h"
#include "http_server.h"
#include "broadcaster.h"
#include "analog_reader.h"
#include "config_manager.h"

Valve valve;
HTTPServer server;
Broadcaster broadcaster;
AnalogReader analog_reader;
ConfigManager config_manager;

void setup() {
  Serial.begin(SERIAL_BAUD_RATE);

  // delay the startup
  delay(500);

  Serial.println("starting launch pad...");

  // ConfigManager
  bool success = config_manager.setup();
  if (!success) {
    Serial.println("fail to setup config manager");
  }

  // get the loaded config
  Config *config = config_manager.get_config();

  // setup the analog reader
  success = analog_reader.setup(config);
  if (!success) {
    Serial.println("fail to setup analog reader");
  }

  // setup the valve
  success = valve.setup(config);
  if (!success) {
    Serial.println("fail to setup valve");
  }

  // setup the server
  success = server.setup(&config_manager, &valve);
  if (!success) {
    Serial.println("fail to setup server");
  }

  // setup the broadcaster
  success = broadcaster.setup(&server, &valve, &analog_reader);
  if (!success) {
    Serial.println("fail to setup broadcaster");
  }

  Serial.println("successful started");
  Serial.flush();
}

void loop() {
  valve.update();
  server.update();
  broadcaster.update();
  analog_reader.update();
}
