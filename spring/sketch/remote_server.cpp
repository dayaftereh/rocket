#include "remote_server.h"

RemoteServer::RemoteServer() : _web_server(REMOTE_SERVER_PORT)
{
}

bool RemoteServer::setup(ConfigManager *config_manager, DataLogger *data_logger, ParachuteManager *parachute_manager)
{
  Serial.println("starting remote server...");

  this->_data_logger = data_logger;
  this->_config_manager = config_manager;
  this->_parachute_manager = parachute_manager;

  // set actibe for startup
  this->_active = true;
  this->_last_broadcast = millis();

  // parse server ip
  IPAddress serverIP;
  boolean success = serverIP.fromString(REMOTE_SERVER_ADDRESS);
  if (!success)
  {
    Serial.println("Fail to parse server ip address");
    return false;
  }

  // parse server ip
  IPAddress gateway;
  success = gateway.fromString(REMOTE_SERVER_GATEWAY);
  if (!success)
  {
    Serial.println("Fail to parse gateway ip address");
    return false;
  }

  // parse subnet mask
  IPAddress subNMask;
  success = subNMask.fromString(REMOTE_SERVER_SUBNET_MASK);
  if (!success)
  {
    Serial.println("Fail to parse subnet mask ip address");
    return false;
  }

  // setup soft access point
  success = WiFi.softAPConfig(serverIP, gateway, subNMask);
  if (!success)
  {
    Serial.println("Fail to configure soft access point");
    return false;
  }

  delay(10);

  // setup the access point
  success = WiFi.softAP(ACCESS_POINT_SSID, ACCESS_POINT_PASSWD, ACCESS_POINT_CHANNEL);
  if (!success)
  {
    Serial.println("Fail to setup access point");
    return false;
  }

  // print the remote server address
  Serial.print("remote server ip-address is [ ");
  Serial.print(WiFi.softAPIP());
  Serial.println(" ]");

  delay(10);

  // start spiffs for the file server
  success = SPIFFS.begin();
  if (!success)
  {
    Serial.println("Fail to setup spiffs");
    return false;
  }

  delay(10);

  // Start the mDNS responder for spring.local
  success = MDNS.begin("spring");
  if (!success) {
    Serial.println("fail to setup MDNS responder!");
    return false;
  }

  delay(10);

  // setup the web-server
  this->_web_server.onNotFound(std::bind(&RemoteServer::handle_not_found, this));
  this->_web_server.on("/api/config", HTTP_GET, std::bind(&RemoteServer::handle_get_configuration, this));
  this->_web_server.on("/api/config", HTTP_POST, std::bind(&RemoteServer::handle_update_configuration, this));
  this->_web_server.on("/api/trigger", HTTP_GET, std::bind(&RemoteServer::handle_trigger_parachute, this));

  // add the websocket hook
  this->_web_server.addHook(this->_web_socket.hookForWebserver("/api/ws", [&](uint8_t num, WStype_t type, uint8_t *payload, size_t length)
  {
    this->handle_web_socket(num, type, payload, length);
  }));

  delay(10);

  this->_web_server.serveStatic("/", SPIFFS, "/index.html");
  this->_web_server.begin();

  return true;
}

void RemoteServer::update()
{
  if (!this->_active)
  {
    return;
  }

  this->_web_socket.loop();
  this->_web_server.handleClient();

  this->broadcast_update();
}

void RemoteServer::broadcast_update()
{
  unsigned long now = millis();
  unsigned long delta = now - this->_last_broadcast;
  // check if bradcast needed
  if (delta < REMOTE_SERVER_BROADCAST_TIMEOUT)
  {
    return;
  }
  // update last broadcast
  this->_last_broadcast = now;

  DataLoggerEntry entry;
  // load the data logger entry
  this->_data_logger->load_data_logger_entry(entry);

  // get the size of the struct
  size_t struct_size = sizeof(entry);
  // get the struct as pointer
  byte *pointer = (byte *)&entry;
  // broadcast the data logger entry
  this->_web_socket.broadcastBIN(pointer, struct_size);
}

void RemoteServer::enable()
{
  this->_active = true;
}

void RemoteServer::disable()
{
  this->_active = false;
}

void RemoteServer::send_result(int16_t t)
{
  // create the json document
  DynamicJsonDocument responseDoc(1024);

  // time as response
  responseDoc["time"] = millis() - t;

  // serialize the response
  String output;
  serializeJson(responseDoc, output);
  // send the response back
  this->_web_server.send(200, "application/json", output);
}

String RemoteServer::read_request_body()
{
  if (!this->_web_server.hasArg("plain"))
  {
    return "";
  }
  String plain = this->_web_server.arg("plain");
  return plain;
}

void RemoteServer::handle_web_socket(uint8_t num, WStype_t type, uint8_t *payload, size_t length)
{
}

void RemoteServer::handle_not_found()
{
  this->_web_server.send(404, "text/plain", "404: Not found");
}

void RemoteServer::handle_get_configuration()
{
  // get the current configuration
  Config *config = this->_config_manager->get_config();

  // create the json document
  DynamicJsonDocument responseDoc(1024);

  responseDoc["parachuteTimeout"] = config->parachute_timeout;
  responseDoc["complimentaryFilter"] = config->complimentary_filter;
  responseDoc["magnetometerOffsetX"] = config->magnetometer_offset_x;
  responseDoc["magnetometerOffsetY"] = config->magnetometer_offset_y;
  responseDoc["magnetometerOffsetZ"] = config->magnetometer_offset_z;

  // serialize the response
  String output;
  serializeJson(responseDoc, output);
  // send the response back
  this->_web_server.send(200, "application/json", output);
}

void RemoteServer::handle_update_configuration()
{
  int16_t t = millis();

  // read the body
  String body = this->read_request_body();

  // create the response doc
  DynamicJsonDocument responseDoc(1024);

  // deserialize incoming body
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, body);
  // check if failed
  if (error)
  {
    this->_web_server.send(400, "text/plain", error.f_str());
    return;
  }

  // get the current configuration
  Config *config = this->_config_manager->get_config();

  bool has_parachute_timeout = doc.containsKey("parachuteTimeout");
  if (has_parachute_timeout)
  {
    config->parachute_timeout = doc["parachuteTimeout"];
  }

  bool has_complimentary_filter = doc.containsKey("complimentaryFilter");
  if (has_complimentary_filter)
  {
    config->complimentary_filter = doc["complimentaryFilter"];
  }

  bool has_magnetometer_offset_x = doc.containsKey("magnetometerOffsetX");
  if (has_magnetometer_offset_x)
  {
    config->magnetometer_offset_x = doc["magnetometerOffsetX"];
  }

  bool has_magnetometer_offset_y = doc.containsKey("magnetometerOffsetY");
  if (has_magnetometer_offset_y)
  {
    config->magnetometer_offset_y = doc["magnetometerOffsetY"];
  }

  bool has_magnetometer_offset_z = doc.containsKey("magnetometerOffsetZ");
  if (has_magnetometer_offset_z)
  {
    config->magnetometer_offset_z = doc["magnetometerOffsetZ"];
  }

  // write the new config to eeprom
  bool success = this->_config_manager->write();
  if (!success)
  {
    this->_web_server.send(400, "text/plain", "fail to commit config");
    return;
  }

  // send result back
  this->send_result(t);
}

void RemoteServer::handle_trigger_parachute()
{
  // trigger the parachute
  this->_parachute_manager->trigger();
  // send ok back
  this->_web_server.send(200, "text/plain", "200: OK");
}
