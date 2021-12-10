#include "trigger_manager.h"

TriggerManager::TriggerManager()
{
}

bool TriggerManager::setup(LEDs *leds)
{
    this->_leds = leds;

    pinMode(TRIGGER_MANAGER_L1_PIN, OUTPUT);
    pinMode(TRIGGER_MANAGER_L2_PIN, OUTPUT);

    this->_leds->delay(10);

    digitalWrite(TRIGGER_MANAGER_L1_PIN, LOW);
    digitalWrite(TRIGGER_MANAGER_L2_PIN, LOW);

    this->l1_off();
    this->l2_off();

    this->_leds->delay(10);

    return true;
}

void TriggerManager::l1_on()
{
    this->_l1 = true;
}

void TriggerManager::l1_off()
{
    this->_l1 = false;
}

void TriggerManager::l2_on()
{
    this->_l2 = true;
}

void TriggerManager::l2_off()
{
    this->_l2 = false;
}

void TriggerManager::update()
{
    digitalWrite(TRIGGER_MANAGER_L1_PIN, this->_l1);
    digitalWrite(TRIGGER_MANAGER_L2_PIN, this->_l2);
}

bool TriggerManager::is_l1()
{
    return this->_l1;
}

bool TriggerManager::is_l2()
{
    return this->_l2;
}