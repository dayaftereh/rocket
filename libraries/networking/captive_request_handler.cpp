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
}