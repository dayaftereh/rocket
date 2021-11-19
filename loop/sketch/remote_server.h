#ifndef _REMOTE_SERVER_H
#define _REMOTE_SERVER_H

#include <FS.h>
#include <SPIFFS.h>
#include <Arduino.h>
#include <AsyncTCP.h>
#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>

#include "data_logger.h"
#include "remote_message.h"
#include "config_manager.h"
#include "flight_observer.h"
#include "parachute_manager.h"

class RemoteServer
{
public:
  RemoteServer();

  bool setup(ConfigManager *config_manager, DataLogger *data_logger, ParachuteManager *parachute_manager, FlightObserver *flight_observer);

  void update();

  void enable();
  void disable();

private:
  void broadcast_update();

  String read_request_body();
  void send_result(int16_t t);

  void handle_not_found();
  void handle_web_socket(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len);

  // configuration
  void handle_get_configuration();
  void handle_update_configuration();

  // parachute
  void handle_trigger_parachute();

  // unlock
  void handle_unlock();

  bool _active;
  unsigned long _last_broadcast;

  AsyncWebSocket _web_socket;
  AsyncWebServer _web_server;

  DataLogger *_data_logger;
  ConfigManager *_config_manager;
  FlightObserver *_flight_observer;
  ParachuteManager *_parachute_manager;
};

#endif // _REMOTE_SERVER_H
