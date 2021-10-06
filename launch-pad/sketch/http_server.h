#ifndef _HTTP_SERVER_H
#define _HTTP_SERVER_H

#include <FS.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ESP8266WebServer.h>
#include <WebSockets4WebServer.h>

#include "valve.h"
#include "config.h"
#include "config_manager.h"

class HTTPServer
{
  public:
    HTTPServer();

    bool setup(ConfigManager *config_manager, Valve *valve);

    void update();

    bool broadcast(String & payload);

  private:

    void handleValve();
    void handleNotFound();
    void handleGETConfiguration();
    void handlePOSTConfiguration();

    void handleWebSocket(uint8_t num, WStype_t type, uint8_t * payload, size_t length);

    String readRequestBody();
    void sendResult(int16_t t);

    ESP8266WebServer *_web_server;

    Valve *_valve;
    ConfigManager *_config_manager;
    WebSockets4WebServer *_web_socket;

};

#endif // _HTTP_SERVER_H
