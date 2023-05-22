
#ifndef _IO_H
#define _IO_H

#include <Print.h>
#include <Arduino.h>

#include "config.h"

class IO
{
public:
    IO();

    bool setup(Print *print);
    bool update();

    void on_l1();
    void off_l1();

    void on_l2();
    void off_l2();

    float get_voltage();

private:
    bool _l1;
    bool _l2;

    float _voltage;

    Print *_print;
};

#endif // _IO_H