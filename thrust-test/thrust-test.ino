
#include <HX711.h>

int VALVE_PIN = 8;
int PRESSURE_PIN = A1;

HX711 hx711;
// HX711 pins
int HX711_DT_PIN = 2;
int HX711_SCK_PIN = 3;
// flag for valve open
bool valveOpen;

unsigned long timer;

void setup() {
  // set valve to false
  valveOpen = false;
  // serial
  Serial.begin(9600);
  // pins
  pinMode(VALVE_PIN, OUTPUT);
  // set start time
  timer = millis();

  // HX711
  hx711.begin(HX711_DT_PIN, HX711_SCK_PIN);
  hx711.set_offset(0);
  hx711.set_scale(1.0);
}

void readSerialIncome() {
  int c;

  while(c != 10) {
    c = Serial.read();
  }  
}

void loop() {
  // read the pressure
  int pressure = analogRead(PRESSURE_PIN);
  // force
  long force = hx711.read();

  // set the valve state
  if (valveOpen) {
    digitalWrite(VALVE_PIN, HIGH);
  } else {
    digitalWrite(VALVE_PIN, LOW);
  }

  if (Serial.available() > 0) {
    readSerialIncome();
  }

  unsigned long now = millis();
  unsigned long delta = now - timer;
  timer = now;

  Serial.print(pressure);
  Serial.print(" ");
  Serial.print(force);
  Serial.print(" ");
  Serial.print(delta);
  Serial.print(" ");
  Serial.print(now);
  Serial.println("");
}
