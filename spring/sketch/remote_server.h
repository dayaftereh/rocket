#ifndef _REMOTE_SERVER_H
#define _REMOTE_SERVER_H

#include <FS.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ESP8266WebServer.h>
#include <WebSockets4WebServer.h>

#include "data_logger.h"
#include "config_manager.h"
#include "parachute_manager.h"

class RemoteServer
{
  public:
    RemoteServer();

    bool setup(ConfigManager *config_manager, DataLogger *data_logger, ParachuteManager* parachute_manager);

    void update();

    void enable();
    void disable();

  private:

    void broadcast_update();

    String read_request_body();
    void send_result(int16_t t);

    void handle_not_found();
    void handle_web_socket(uint8_t num, WStype_t type, uint8_t * payload, size_t length);

    // configuration
    void handle_get_configuration();
    void handle_update_configuration();

    // parachute
    void handle_trigger_parachute();

    bool _active;
    unsigned long _last_broadcast;

    ESP8266WebServer _web_server;
    WebSockets4WebServer _web_socket;

    DataLogger *_data_logger;
    ConfigManager *_config_manager;
    ParachuteManager* _parachute_manager;
};

#endif // _REMOTE_SERVER_H
