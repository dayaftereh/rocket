#include "http_server.h"
#include "analog_reader.h"
#include "config_manager.h"

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

  Config *config = configManager.get_config();

  // setup the analog reader
  success = analogReader.setup(config);
  if (!success) {
    Serial.println("fail to setup analog reader");
  }

  // setup the server
  success = server.setup(&configManager);
  if (!success) {
    Serial.println("fail to setup server");
  }

  Serial.println("successful started");
  Serial.flush();
}

void loop() {
  server.update();
  analogReader.update();
}
