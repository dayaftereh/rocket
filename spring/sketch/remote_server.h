#ifndef _REMOTE_SERVER_H
#define _REMOTE_SERVER_H

#include <FS.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WebServer.h>
#include <WebSockets4WebServer.h>

#include "imu.h"
#include "data_logger.h"
#include "remote_message.h"
#include "config_manager.h"
#include "flight_observer.h"
#include "parachute_manager.h"

class RemoteServer
{
public:
  RemoteServer();

  bool setup(ConfigManager *config_manager, DataLogger *data_logger, ParachuteManager *parachute_manager, FlightObserver *flight_observer, IMU *imu);

  void update();

  void enable();
  void disable();

private:
  void broadcast_update();

  String read_request_body();
  void send_result(int16_t t);

  void handle_not_found();
  void handle_web_socket(uint8_t num, WStype_t type, uint8_t *payload, size_t length);

  // configuration
  void handle_get_configuration();
  void handle_update_configuration();

  // parachute
  void handle_open_parachute();
  void handle_close_parachute();
  void handle_trigger_parachute();

  // unlock
  void handle_unlock();
  void handle_flight_terminate();

  bool _active;
  unsigned long _last_broadcast;

  ESP8266WebServer _web_server;
  WebSockets4WebServer _web_socket;

  IMU *_imu;
  DataLogger *_data_logger;
  ConfigManager *_config_manager;
  FlightObserver *_flight_observer;
  ParachuteManager *_parachute_manager;
};

#endif // _REMOTE_SERVER_H
