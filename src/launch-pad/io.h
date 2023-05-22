#ifndef _IO_H
#define _IO_H

#include <stats.h>
#include <Print.h>

#include "config.h"

class IO
{
public:
    IO();

    bool setup(Config *config, Stats *stats, Print *print);

    void honk();
    void abort_valve();
    void launch_valve();

    float get_voltage();
    float get_pressure();

    void update();

private:
    void update_honk();
    void update_abort();
    void update_launch();

    bool _honk;
    bool _abort;
    bool _launch;

    float _honk_timer;
    float _launch_timer;

    float _voltage;
    float _pressure;

    Stats *_stats;
    Print *_print;
    Config *_config;
};

#endif // _IO_H