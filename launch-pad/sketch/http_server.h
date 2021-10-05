#ifndef _HTTP_SERVER_H
#define _HTTP_SERVER_H

#include <FS.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ESP8266WebServer.h>

#include "config.h"
#include "config_manager.h"

class HTTPServer
{
  public:
    HTTPServer();

    bool setup(ConfigManager *config_manager);

    void update();

  private:

    void handleNotFound();
    void handleGETConfiguration();
    void handlePOSTConfiguration();

    String readRequestBody();

    ESP8266WebServer *_web_server;
    ConfigManager *_config_manager;

};

#endif // _HTTP_SERVER_H
