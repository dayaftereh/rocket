#define STEP_PIN D8
#define SPEED_PIN A0
#define DIRECTION_PIN D7

bool flag;
uint32_t timer;

void setup()
{
  Serial.begin(115200);

  pinMode(STEP_PIN, OUTPUT);
  pinMode(DIRECTION_PIN, OUTPUT);

  digitalWrite(DIRECTION_PIN, HIGH);

  flag = false;
  timer = micros();
}

void loop()
{
  digitalWrite(STEP_PIN, flag);
  int val = analogRead(SPEED_PIN);
  float timeout = (((float)val) / 1024.0) * 1000.0;

  Serial.println(timeout, 3);

  uint32_t now = micros();
  uint32_t delay = now - timer;
  if (delay > timeout)
  {
    flag = !flag;
    timer = now;
  }
}
