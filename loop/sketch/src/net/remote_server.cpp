#include "remote_server.h"

RemoteServer::RemoteServer() : _web_server(REMOTE_SERVER_PORT), _web_socket("/api/ws")
{
}

bool RemoteServer::setup(ConfigManager *config_manager, LEDs *leds, DataLogger *data_logger, ParachuteManager *parachute_manager, FlightObserver *flight_observer, TriggerManager *trigger_manager)
{
  Serial.println("starting remote server...");

  this->_leds = leds;
  this->_data_logger = data_logger;
  this->_config_manager = config_manager;
  this->_flight_observer = flight_observer;
  this->_trigger_manager = trigger_manager;
  this->_parachute_manager = parachute_manager;

  // set active for startup
  this->_active = true;
  this->_last_broadcast = millis();

  // start spiffs for the file server
  bool success = SPIFFS.begin();
  if (!success)
  {
    Serial.println("Fail to setup spiffs");
    return false;
  }

  this->_leds->delay(10);

  this->_web_socket.onEvent([&](AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
                            { this->handle_web_socket(server, client, type, arg, data, len); });

  // setup the web-server
  this->_web_server.onNotFound([this](AsyncWebServerRequest *request)
                               { this->handle_not_found(request); });
  // Unlock
  this->_web_server.on("/api/unlock", HTTP_GET, [this](AsyncWebServerRequest *request)
                       { this->handle_unlock(request); });

  // Config
  this->_web_server.on("/api/config", HTTP_GET, [this](AsyncWebServerRequest *request)
                       { this->handle_get_configuration(request); });

  AsyncCallbackJsonWebHandler *config_update = new AsyncCallbackJsonWebHandler(
      "/api/config",
      [this](AsyncWebServerRequest *request, JsonVariant &json)
      {
        this->handle_update_configuration(request, json);
      });
  this->_web_server.addHandler(config_update);

  // Parachute
  this->_web_server.on("/api/parachute/open", HTTP_GET, [this](AsyncWebServerRequest *request)
                       { this->handle_open_parachute(request); });
  this->_web_server.on("/api/parachute/close", HTTP_GET, [this](AsyncWebServerRequest *request)
                       { this->handle_close_parachute(request); });
  this->_web_server.on("/api/parachute/trigger", HTTP_GET, [this](AsyncWebServerRequest *request)
                       { this->handle_trigger_parachute(request); });

  // Trigger
  this->_web_server.on("/api/trigger", HTTP_GET, [this](AsyncWebServerRequest *request)
                       { this->handle_get_trigger(request); });

  AsyncCallbackJsonWebHandler *trigger = new AsyncCallbackJsonWebHandler(
      "/api/trigger",
      [this](AsyncWebServerRequest *request, JsonVariant &json)
      {
        this->handle_update_trigger(request, json);
      });
  this->_web_server.addHandler(trigger);

  // WebSocket
  this->_web_server.addHandler(&this->_web_socket);

  this->_leds->delay(10);

  this->_web_server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html");
  this->_web_server.begin();

  return true;
}

void RemoteServer::update()
{
  if (!this->_active)
  {
    return;
  }

  this->_web_socket.cleanupClients();

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

  RemoteMessage message;
  // load the remote message
  this->_data_logger->load_remote_message(message);

  // get the size of the message
  size_t struct_size = sizeof(message);
  // get the message as pointer
  uint8_t *pointer = (uint8_t *)(&message);
  // broadcast the remote message
  this->_web_socket.binaryAll(pointer, struct_size);
}

void RemoteServer::enable()
{
  this->_active = true;
}

void RemoteServer::disable()
{
  this->_active = false;
}

void RemoteServer::send_result(AsyncWebServerRequest *request, int16_t t)
{
  // create the json document
  DynamicJsonDocument responseDoc(1024);

  // time as response
  responseDoc["time"] = millis() - t;

  // serialize the response
  String output;
  serializeJson(responseDoc, output);
  // send the response back
  request->send(200, "application/json", output);
}

void RemoteServer::handle_web_socket(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
{
}

void RemoteServer::handle_not_found(AsyncWebServerRequest *request)
{
  request->send(404, "text/plain", "404: Not found");
}

void RemoteServer::handle_get_configuration(AsyncWebServerRequest *request)
{
  // get the current configuration
  Config *config = this->_config_manager->get_config();

  // create the json document
  DynamicJsonDocument responseDoc(2048);

  responseDoc["parachuteServo"] = config->parachute_servo;
  responseDoc["parachuteTimeout"] = config->parachute_timeout;
  responseDoc["parachuteServoOpenAngle"] = config->parachute_servo_open_angle;
  responseDoc["parachuteServoCloseAngle"] = config->parachute_servo_close_angle;

  responseDoc["launchAcceleration"] = config->launch_acceleration;

  responseDoc["rotationX"] = config->rotation_x;
  responseDoc["rotationY"] = config->rotation_y;
  responseDoc["rotationZ"] = config->rotation_z;

  responseDoc["madgwickKI"] = config->madgwick_ki;
  responseDoc["madgwickKP"] = config->madgwick_kp;

  responseDoc["launchAngle"] = config->launch_angle;
  responseDoc["launchAcceleration"] = config->launch_acceleration;

  responseDoc["liftOffVelocityThreshold"] = config->lift_off_velocity_threshold;

  responseDoc["apogeeVelocityThreshold"] = config->apogee_velocity_threshold;
  responseDoc["apogeeAltitudeThreshold"] = config->apogee_altitude_threshold;
  responseDoc["apogeeOrientationThreshold"] = config->apogee_orientation_threshold;

  responseDoc["landingAcceleration"] = config->landing_acceleration;
  responseDoc["landingAltitudeThreshold"] = config->landing_altitude_threshold;
  responseDoc["landingOrientationTimeout"] = config->landing_orientation_timeout;
  responseDoc["landingOrientationThreshold"] = config->landing_orientation_threshold;

  // serialize the response
  String output;
  serializeJson(responseDoc, output);
  // send the response back
  request->send(200, "application/json", output);
}

void RemoteServer::handle_update_configuration(AsyncWebServerRequest *request, JsonVariant &json)
{
  int16_t t = millis();

  JsonObject doc = json.as<JsonObject>();

  // get the current configuration
  Config *config = this->_config_manager->get_config();

  // parachute
  bool has_parachute_servo = doc.containsKey("parachuteServo");
  if (has_parachute_servo)
  {
    config->parachute_servo = doc["parachuteServo"];
  }

  bool has_parachute_timeout = doc.containsKey("parachuteTimeout");
  if (has_parachute_timeout)
  {
    config->parachute_timeout = doc["parachuteTimeout"];
  }

  bool has_parachute_servo_open_angle = doc.containsKey("parachuteServoOpenAngle");
  if (has_parachute_servo_open_angle)
  {
    config->parachute_servo_open_angle = doc["parachuteServoOpenAngle"];
  }

  bool has_parachute_servo_close_angle = doc.containsKey("parachuteServoCloseAngle");
  if (has_parachute_servo_close_angle)
  {
    config->parachute_servo_close_angle = doc["parachuteServoCloseAngle"];
  }

  // madgwick
  bool has_madgwick_ki = doc.containsKey("madgwickKI");
  if (has_madgwick_ki)
  {
    config->madgwick_ki = doc["madgwickKI"];
  }

  bool has_madgwick_kp = doc.containsKey("madgwickKP");
  if (has_madgwick_kp)
  {
    config->madgwick_kp = doc["madgwickKP"];
  }

  // rotation
  bool has_rotation_x = doc.containsKey("rotationX");
  if (has_rotation_x)
  {
    config->rotation_x = doc["rotationX"];
  }

  bool has_rotation_y = doc.containsKey("rotationY");
  if (has_rotation_y)
  {
    config->rotation_y = doc["rotationY"];
  }

  bool has_rotation_z = doc.containsKey("rotationZ");
  if (has_rotation_z)
  {
    config->rotation_z = doc["rotationZ"];
  }

  // launch
  bool has_launch_angle = doc.containsKey("launchAngle");
  if (has_launch_angle)
  {
    config->launch_angle = doc["launchAngle"];
  }

  bool has_launch_acceleration = doc.containsKey("launchAcceleration");
  if (has_launch_acceleration)
  {
    config->launch_acceleration = doc["launchAcceleration"];
  }

  // Lift Off
  bool has_lift_off_velocity_threshold = doc.containsKey("liftOffVelocityThreshold");
  if (has_lift_off_velocity_threshold)
  {
    config->lift_off_velocity_threshold = doc["liftOffVelocityThreshold"];
  }

  // apogee
  bool has_apogee_velocity_threshold = doc.containsKey("apogeeVelocityThreshold");
  if (has_apogee_velocity_threshold)
  {
    config->apogee_velocity_threshold = doc["apogeeVelocityThreshold"];
  }

  bool has_apogee_altitude_threshold = doc.containsKey("apogeeAltitudeThreshold");
  if (has_apogee_altitude_threshold)
  {
    config->apogee_altitude_threshold = doc["apogeeAltitudeThreshold"];
  }

  bool has_apogee_orientation_threshold = doc.containsKey("apogeeOrientationThreshold");
  if (has_apogee_orientation_threshold)
  {
    config->apogee_orientation_threshold = doc["apogeeOrientationThreshold"];
  }

  // landing
  bool has_landing_acceleration = doc.containsKey("landingAcceleration");
  if (has_landing_acceleration)
  {
    config->landing_acceleration = doc["landingAcceleration"];
  }

  bool has_landing_altitude_threshold = doc.containsKey("landingAltitudeThreshold");
  if (has_landing_altitude_threshold)
  {
    config->landing_altitude_threshold = doc["landingAltitudeThreshold"];
  }

  bool has_landing_orientation_timeout = doc.containsKey("landingOrientationTimeout");
  if (has_landing_orientation_timeout)
  {
    config->landing_orientation_timeout = doc["landingOrientationTimeout"];
  }

  bool has_landing_orientation_threshold = doc.containsKey("landingOrientationThreshold");
  if (has_landing_orientation_threshold)
  {
    config->landing_orientation_threshold = doc["landingOrientationThreshold"];
  }

  // write the new config to eeprom
  bool success = this->_config_manager->write();
  if (!success)
  {
    request->send(400, "text/plain", "fail to commit config");
    return;
  }

  // send result back
  this->send_result(request, t);
}

void RemoteServer::handle_open_parachute(AsyncWebServerRequest *request)
{
  this->_parachute_manager->open();
  // send ok back
  request->send(200, "text/plain", "200: OK");
}
void RemoteServer::handle_close_parachute(AsyncWebServerRequest *request)
{
  this->_parachute_manager->close();
  // send ok back
  request->send(200, "text/plain", "200: OK");
}

void RemoteServer::handle_trigger_parachute(AsyncWebServerRequest *request)
{
  // trigger the parachute
  this->_parachute_manager->trigger();
  // send ok back
  request->send(200, "text/plain", "200: OK");
}

void RemoteServer::handle_unlock(AsyncWebServerRequest *request)
{
  this->_flight_observer->unlock();
  // send ok back
  request->send(200, "text/plain", "200: OK");
}

void RemoteServer::handle_get_trigger(AsyncWebServerRequest *request)
{
  // create the json document
  DynamicJsonDocument responseDoc(512);

  responseDoc["l1"] = this->_trigger_manager->is_l1();
  responseDoc["l2"] = this->_trigger_manager->is_l2();

  // serialize the response
  String output;
  serializeJson(responseDoc, output);
  // send the response back
  request->send(200, "application/json", output);
}

void RemoteServer::handle_update_trigger(AsyncWebServerRequest *request, JsonVariant &json)
{
  int16_t t = millis();
  JsonObject doc = json.as<JsonObject>();

  // l1
  bool has_l1 = doc.containsKey("l1");
  if (has_l1)
  {
    bool l1 = doc["l1"];
    if (l1)
    {
      this->_trigger_manager->l1_on();
    }
    else
    {
      this->_trigger_manager->l1_off();
    }
  }

  // l2
  bool has_l2 = doc.containsKey("l2");
  if (has_l2)
  {
    bool l2 = doc["l2"];
    if (l2)
    {
      this->_trigger_manager->l2_on();
    }
    else
    {
      this->_trigger_manager->l2_off();
    }
  }

  // send result back
  this->send_result(request, t);
}