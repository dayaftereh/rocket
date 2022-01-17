#define STEP_PIN D8
#define SPEED_PIN A0
#define DIRECTION_PIN D7

bool flag;
int timeout;
uint32_t timer;

void setup()
{
    Serial.begin(115200);

    pinMode(STEP_PIN, OUTPUT);
    pinMode(DIRECTION_PIN, OUTPUT);

    digitalWrite(DIRECTION_PIN, HIGH);

    flag = false;
    timer = millis();
}

void loop()
{
    digitalWrite(STEP_PIN, flag);
    float val = analogRead(SPEED_PIN);
    timeout = (int)((val / 1023.0) * 250.0);

    uint32_t now = millis();
    uint32_t delay = now - timer;
    if (delay > timeout)
    {
        flag = !flag;
    }
}