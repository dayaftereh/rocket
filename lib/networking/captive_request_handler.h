#ifndef _CAPTIVE_REQUEST_HANDLER_H
#define _CAPTIVE_REQUEST_HANDLER_H

#include <ESPAsyncWebServer.h>

class CaptiveRequestHandler : public AsyncWebHandler
{
public:
    CaptiveRequestHandler();
    virtual ~CaptiveRequestHandler();

    bool canHandle(AsyncWebServerRequest *request);
    void handleRequest(AsyncWebServerRequest *request);
};

#endif // _CAPTIVE_REQUEST_HANDLER_H