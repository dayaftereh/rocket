
#ifndef _ROCKET_CLIENT_H
#define _ROCKET_CLIENT_H

#include <imu.h>
#include <leds.h>
#include <stats.h>
#include <Print.h>
#include <Arduino.h>
#include <network_client.h>
#include <fligth_computer.h>
#include <parachute_manager.h>
#include <rocket_config_message.h>
#include <rocket_status_message.h>
#include <rocket_telemetry_message.h>

#include "io.h"
#include "config.h"

class RocketClient
{
public:
    RocketClient();

    bool setup(Config *config, FlightComputer *flight_computer, ParachuteManager *parachute_manager, IMU *imu, IO *io, Stats *stats, Leds *leds, Print *print);

    bool update();

private:
    void send_hello();
    void send_config();
    void send_status();
    void send_telemetry();

    void on_message(WebMessageType message_type, uint8_t *data, size_t len);

    void on_start_message();
    void on_abort_message();
    void on_unlock_message();
    void on_open_parachute_message();
    void on_close_parachute_message();
    void on_config_message(uint8_t *data, size_t len);

    uint32_t _status_message_timer;
    uint32_t _telemetry_message_timer;

    NetworkClient _network_client;

    IO *_io;
    IMU *_imu;
    Leds *_leds;
    Stats *_stats;
    Print *_print;
    Config *_config;
    FlightComputer *_flight_computer;
    ParachuteManager *_parachute_manager;
};

#endif // _ROCKET_CLIENT_H