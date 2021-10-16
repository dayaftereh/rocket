#include "config_manager.h"

ConfigManager configManager;

void setup() {
  Serial.begin(SERIAL_BAUD_RATE);

  // delay the startup
  delay(500);

  bool success = configManager.setup();
  if (!success) {
    Serial.println("fail to setup config manager");
  }
}

void loop() {
}
