#include "captive_request_handler.h"

CaptiveRequestHandler::CaptiveRequestHandler()
{
}

CaptiveRequestHandler::~CaptiveRequestHandler()
{
}

bool CaptiveRequestHandler::canHandle(AsyncWebServerRequest *request)
{
    return true;
}

void CaptiveRequestHandler::handleRequest(AsyncWebServerRequest *request)
{
    AsyncResponseStream *response = request->beginResponseStream("text/html");
    response->print("<!DOCTYPE html><html><head><title>Captive Portal</title></head><body>");
    response->print("<p>This is out captive portal front page.</p>");
    response->printf("<p>You were trying to reach: http://%s%s</p>", request->host().c_str(), request->url().c_str());
    response->printf("<p>Try opening <a href='http://%s'>this link</a> instead</p>", WiFi.softAPIP().toString().c_str());
    response->print("</body></html>");
    request->send(response);
}