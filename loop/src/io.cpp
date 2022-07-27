#include "io.h"

IO::IO()
{
}

bool IO::setup(Print *print)
{
    this->_print = print;

    pinMode(IO_L1_PIN, OUTPUT);
    pinMode(IO_L2_PIN, OUTPUT);

    this->off_l1();
    this->off_l2();

    return true;
}

bool IO::update()
{
    digitalWrite(IO_L1_PIN, this->_l1);
    digitalWrite(IO_L2_PIN, this->_l2);

    int raw_volatage = analogRead(IO_VOLTAGE_PIN);
    this->_voltage = (((float)raw_volatage) / 4095.0) * 2.0;

    return true;
}

void IO::on_l1()
{
    this->_l1 = true;
}
void IO::off_l1()
{
    this->_l1 = false;
}

void IO::on_l2()
{
    this->_l2 = true;
}
void IO::off_l2()
{
    this->_l2 = false;
}

float IO::get_voltage()
{
    return this->_voltage;
}