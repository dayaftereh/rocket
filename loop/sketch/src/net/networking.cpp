#include "networking.h"

Networking::Networking()
{
}

bool Networking::setup(LEDs *leds)
{
  this->_leds = leds;

  Serial.println("starting networking...");

  // parse server ip
  IPAddress serverIP;
  boolean success = serverIP.fromString(REMOTE_SERVER_ADDRESS);
  if (!success)
  {
    Serial.println("Fail to parse server ip address");
    return false;
  }

  // parse server ip
  IPAddress gateway;
  success = gateway.fromString(REMOTE_SERVER_GATEWAY);
  if (!success)
  {
    Serial.println("Fail to parse gateway ip address");
    return false;
  }

  // parse subnet mask
  IPAddress subNMask;
  success = subNMask.fromString(REMOTE_SERVER_SUBNET_MASK);
  if (!success)
  {
    Serial.println("Fail to parse subnet mask ip address");
    return false;
  }  

  // setup the access point
  success = WiFi.softAP(ACCESS_POINT_SSID, ACCESS_POINT_PASSWD, ACCESS_POINT_CHANNEL);
  if (!success)
  {
    Serial.println("Fail to setup access point");
    return false;
  }

  // setup soft access point
  success = WiFi.softAPConfig(serverIP, gateway, subNMask);
  if (!success)
  {
    Serial.println("Fail to configure soft access point");
    return false;
  }

  success = WiFi.softAPsetHostname(REMOTE_SERVER_HOSTNAME);
  if (!success)
  {
    Serial.println("Fail to set hostname");
    return false;
  }

  // print the remote server address
  Serial.print("remote server ip-address is [ ");
  Serial.print(WiFi.softAPIP());
  Serial.println(" ]");

  this->_leds->sleep(10);

  // Start the mDNS responder for spring.local
  success = MDNS.begin("spring");
  if (!success)
  {
    Serial.println("fail to setup MDNS responder!");
    return false;
  }

  return true;
}
