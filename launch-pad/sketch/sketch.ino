#include "valve.h"
#include "http_server.h"
#include "analog_reader.h"
#include "config_manager.h"

Valve valve;
HTTPServer server;
AnalogReader analogReader;
ConfigManager configManager;

void setup() {
  Serial.begin(SERIAL_BAUD_RATE);

  // delay the startup
  delay(500);

  Serial.println("starting launch pad...");

  // ConfigManager
  bool success = configManager.setup();
  if (!success) {
    Serial.println("fail to setup config manager");
  }

  // get the loaded config
  Config *config = configManager.get_config();

  // setup the analog reader
  success = analogReader.setup(config);
  if (!success) {
    Serial.println("fail to setup analog reader");
  }

  // setup the valve
  success = valve.setup(config);
  if (!success) {
    Serial.println("fail to setup valve");
  }

  // setup the server
  success = server.setup(&configManager, &valve);
  if (!success) {
    Serial.println("fail to setup server");
  }

  Serial.println("successful started");
  Serial.flush();
}

void loop() {
  valve.update();
  server.update();
  analogReader.update();
}
