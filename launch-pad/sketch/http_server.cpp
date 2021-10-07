#include "http_server.h"

HTTPServer::HTTPServer() {

}

bool HTTPServer::setup(ConfigManager *config_manager, Valve *valve) {
  this->_valve = valve;
  this->_config_manager = config_manager;

  // parse server ip
  IPAddress serverIP;
  boolean success = serverIP.fromString(HTTP_SERVER_ADDRESS);
  if (!success) {
    Serial.println("Fail to parse server ip address");
    return false;
  }

  // parse server ip
  IPAddress gateway;
  success = gateway.fromString(HTTP_SERVER_GATEWAY);
  if (!success) {
    Serial.println("Fail to parse gateway ip address");
    return false;
  }

  // parse subnet mask
  IPAddress subNMask;
  success = subNMask.fromString(HTTP_SERVER_SUBNET_MASK);
  if (!success) {
    Serial.println("Fail to parse subnet mask ip address");
    return false;
  }

  // setup soft access point
  success = WiFi.softAPConfig(serverIP, gateway, subNMask);
  if (!success) {
    Serial.println("Fail to configure soft access point");
    return false;
  }

  // setup the access point
  success = WiFi.softAP(ACCESS_POINT_SSID, ACCESS_POINT_PASSWD);
  if (!success) {
    Serial.println("Fail to setup access point");
    return false;
  }

  // start spiffs for the file server
  success = SPIFFS.begin();
  if (!success) {
    Serial.println("Fail to setup spiffs");
    return false;
  }

  // setup websocket server
  this->_web_socket = new WebSockets4WebServer();

  // setup the web-server
  this->_web_server = new ESP8266WebServer(HTTP_SERVER_PORT);
  this->_web_server->onNotFound(std::bind(&HTTPServer::handleNotFound, this));

  this->_web_server->on("/api/valve", HTTP_POST, std::bind(&HTTPServer::handleValve, this));
  this->_web_server->on("/api/config", HTTP_GET, std::bind(&HTTPServer::handleGETConfiguration, this));
  this->_web_server->on("/api/config", HTTP_POST, std::bind(&HTTPServer::handlePOSTConfiguration, this));

  // add the websocket hook
  this->_web_server->addHook(this->_web_socket->hookForWebserver("/api/ws", [&](uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    this->handleWebSocket(num, type, payload, length);
  }));

  this->_web_server->serveStatic("/", SPIFFS, "/index.html");
  this->_web_server->begin();

  return true;
}

void HTTPServer::update() {
  this->_web_socket->loop();
  this->_web_server->handleClient();
}

String HTTPServer::readRequestBody() {
  if (!this->_web_server->hasArg("plain")) {
    return "";
  }
  String plain = this->_web_server->arg("plain");
  return plain;
}


void HTTPServer::handleWebSocket(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
}

void HTTPServer::handleNotFound() {
  this->_web_server->send(404, "text/plain", "404: Not found");
}

void HTTPServer::handleGETConfiguration() {
  // get the current configuration
  Config *config = this->_config_manager->get_config();

  // create the json document
  DynamicJsonDocument responseDoc(1024);

  // pressure
  responseDoc["pressureFactor"] = config->pressureFactor;
  responseDoc["pressureOffset"] = config->pressureOffset;
  // voltage
  responseDoc["voltageFactor"] = config->voltageFactor;
  responseDoc["voltageOffset"] = config->voltageOffset;
  // valve
  responseDoc["openTimeout"] = config->openTimeout;

  // serialize the response
  String output;
  serializeJson(responseDoc, output);
  // send the response back
  this->_web_server->send(200, "application/json", output);
}

void HTTPServer::handlePOSTConfiguration() {
  int16_t t = millis();

  // read the body
  String body = this->readRequestBody();

  // create the response doc
  DynamicJsonDocument responseDoc(1024);

  // deserialize incoming body
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, body);
  // check if failed
  if (error) {
    this->_web_server->send(400, "text/plain", error.f_str());
    return;
  }

  // get the current configuration
  Config *config = this->_config_manager->get_config();

  // check if pressureFactor given
  bool hasPressureFactor = doc.containsKey("pressureFactor");
  if (hasPressureFactor) {
    config->pressureFactor = doc["pressureFactor"];
  }

  // check if pressureOffset given
  bool hasPressureOffset = doc.containsKey("pressureOffset");
  if (hasPressureOffset) {
    config->pressureOffset = doc["pressureOffset"];
  }

  // check if voltageFactor given
  bool hasVoltageFactor = doc.containsKey("voltageFactor");
  if (hasVoltageFactor) {
    config->voltageFactor = doc["voltageFactor"];
  }

  // check if voltageOffset given
  bool hasVoltageOffset = doc.containsKey("voltageOffset");
  if (hasVoltageOffset) {
    config->voltageOffset = doc["voltageOffset"];
  }

  // check if openTimeout given
  bool hasOpenTimeout = doc.containsKey("openTimeout");
  if (hasOpenTimeout) {
    config->openTimeout = doc["openTimeout"];
  }

  // write the new config to eeprom
  bool success = this->_config_manager->write();
  if(!success) {
    this->_web_server->send(400, "text/plain", "fail to commit config");
    return;
  }

  // send result back
  this->sendResult(t);
}

void HTTPServer::handleValve() {
  int16_t t = millis();

  // read the body
  String body = this->readRequestBody();

  // create the response doc
  DynamicJsonDocument responseDoc(1024);

  // deserialize incoming body
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, body);
  // check if failed
  if (error) {
    this->_web_server->send(400, "text/plain", error.f_str());
    return;
  }

  // check if open given
  bool hasOpen = doc.containsKey("open");
  if (hasOpen) {
    bool open = doc["open"];

    // open the valve
    if (open) {
      this->_valve->open();
    } else  {
      this->_valve->close();
    }

  }

  // send result back
  this->sendResult(t);
}

bool HTTPServer::broadcast(String & payload) {
  bool success = this->_web_socket->broadcastTXT(payload);
  return success;
}

void HTTPServer::sendResult(int16_t t) {
  // create the json document
  DynamicJsonDocument responseDoc(1024);

  // time as response
  responseDoc["time"] = millis() - t;

  // serialize the response
  String output;
  serializeJson(responseDoc, output);
  // send the response back
  this->_web_server->send(200, "application/json", output);
}
