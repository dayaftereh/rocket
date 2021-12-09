#ifndef _REMOTE_SERVER_H
#define _REMOTE_SERVER_H

#include <FS.h>
#include <SPIFFS.h>
#include <Arduino.h>
#include <AsyncTCP.h>
#include <AsyncJson.h>
#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>

#include "../utils/leds.h"
#include "../config/config.h"
#include "../flight_observer.h"
#include "../logger/data_logger.h"
#include "../config/config_manager.h"
#include "../parachute/parachute_manager.h"

#include "remote_message.h"

class RemoteServer
{
public:
  RemoteServer();

  bool setup(ConfigManager *config_manager, LEDs *leds, DataLogger *data_logger, ParachuteManager *parachute_manager, FlightObserver *flight_observer);

  void update();

  void enable();
  void disable();

private:
  void broadcast_update();

  void send_result(AsyncWebServerRequest *request, int16_t t);

  void handle_not_found(AsyncWebServerRequest *request);
  void handle_web_socket(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);

  // configuration
  void handle_get_configuration(AsyncWebServerRequest *request);
  void handle_update_configuration(AsyncWebServerRequest *request, JsonVariant &json);

  // parachute
  void handle_open_parachute(AsyncWebServerRequest *request);
  void handle_close_parachute(AsyncWebServerRequest *request);
  void handle_trigger_parachute(AsyncWebServerRequest *request);

  // unlock
  void handle_unlock(AsyncWebServerRequest *request);

  bool _active;
  unsigned long _last_broadcast;

  AsyncWebSocket _web_socket;
  AsyncWebServer _web_server;

  LEDs *_leds;
  DataLogger *_data_logger;
  ConfigManager *_config_manager;
  FlightObserver *_flight_observer;
  ParachuteManager *_parachute_manager;
};

#endif // _REMOTE_SERVER_H
