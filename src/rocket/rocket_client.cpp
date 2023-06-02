#include "rocket_client.h"

RocketClient::RocketClient()
{
}

bool RocketClient::setup(Config *config, FlightComputer *flight_computer, ParachuteManager *parachute_manager, IMU *imu, IO *io, Stats *stats, Leds *leds, Print *print)
{
    this->_io = io;
    this->_imu = imu;
    this->_leds = leds;
    this->_stats = stats;
    this->_print = print;
    this->_config = config;
    this->_flight_computer = flight_computer;
    this->_parachute_manager = parachute_manager;

    this->_status_message_timer = millis();
    this->_telemetry_message_timer = millis();

    // set the message handler
    this->_network_client.set_websocket_message_handler([=](WebMessageType message_type, uint8_t *data, size_t len)
                                                        { this->on_message(message_type, data, len); });

    // setup the network client
    bool success = this->_network_client.setup(config, leds, print);
    if (!success)
    {
        this->_print->println("fail to setup network client");
        return false;
    }

    // notify launchpad to be the rocket
    this->send_hello();

    return true;
}

void RocketClient::send_hello()
{
    WebMessage message;
    message.message_type = HELLO_ROCKET_MESSAGE_TYPE;

    uint8_t *data = reinterpret_cast<uint8_t *>(&message);
    this->_network_client.send(data, sizeof(message));
}

void RocketClient::on_message(WebMessageType message_type, uint8_t *data, size_t len)
{
    switch (message_type)
    {
    case ROCKET_START_MESSAGE_TYPE:
        this->on_start_message();
        return;
    case ROCKET_ABORT_MESSAGE_TYPE:
        this->on_abort_message();
        return;
    case ROCKET_UNLOCK_MESSAGE_TYPE:
        this->on_unlock_message();
        return;
    case ROCKET_OPEN_PARACHUTE_MESSAGE_TYPE:
        this->on_open_parachute_message();
        return;
    case ROCKET_CLOSE_PARACHUTE_MESSAGE_TYPE:
        this->on_close_parachute_message();
        return;
    case ROCKET_CONFIG_MESSAGE_TYPE:
        this->on_config_message(data, len);
        return;
    case REQUEST_ROCKET_CONFIG_MESSAGE_TYPE:
        this->send_config();
        return;
    }
}

void RocketClient::on_start_message()
{
}

void RocketClient::on_abort_message()
{
    this->_flight_computer->abort();
}

void RocketClient::on_unlock_message()
{
    this->_flight_computer->unlock();
}

void RocketClient::on_open_parachute_message()
{
    this->_parachute_manager->open();
}

void RocketClient::on_close_parachute_message()
{
    this->_parachute_manager->close();
}

void RocketClient::on_config_message(uint8_t *data, size_t len)
{
    RocketConfigMessage *message = reinterpret_cast<RocketConfigMessage *>(data);

    // TODO UpdateConfig
}

void RocketClient::send_config()
{
    RocketConfigMessage message;
    message.message_type = ROCKET_CONFIG_MESSAGE_TYPE;

    // TODO Set Config

    uint8_t *data = reinterpret_cast<uint8_t *>(&message);
    this->_network_client.send(data, sizeof(message));
}

void RocketClient::send_status()
{
    RocketStatusMessage message;
    message.message_type = ROCKET_STATUS_MESSAGE_TYPE;

    // get the current filght computer state
    FlightComputerState state = this->_flight_computer->get_state();
    message.state = (int)state;
    // set error to false
    message.error = false;

    uint8_t *data = reinterpret_cast<uint8_t *>(&message);
    this->_network_client.send(data, sizeof(message));
}

void RocketClient::send_telemetry()
{
    RocketTelemetryMessage message;
    message.message_type = ROCKET_TELEMETRY_MESSAGE_TYPE;

    // timeing
    message.time = millis();
    message.elapsed = this->_stats->get_delta();

    // io
    message.voltage = this->_io->get_voltage();

    // altitude
    message.altitude = 0.0;

    // rotation
    Quaternion *rotation = this->_imu->get_orientation();
    Vec3f euler = rotation->get_euler();
    message.rotation_x = euler.x;
    message.rotation_y = euler.y;
    message.rotation_z = euler.z;

    // gyroscope
    Vec3f *gyroscope = this->_imu->get_gyroscope();
    message.gyroscope_x = gyroscope->x;
    message.gyroscope_y = gyroscope->y;
    message.gyroscope_z = gyroscope->z;

    // acceleration
    Vec3f *acceleration = this->_imu->get_gyroscope();
    message.acceleration_x = acceleration->x;
    message.acceleration_y = acceleration->y;
    message.acceleration_z = acceleration->z;

    // magnetometer
    Vec3f *magnetometer = this->_imu->get_gyroscope();
    message.magnetometer_x = magnetometer->x;
    message.magnetometer_y = magnetometer->y;
    message.magnetometer_z = magnetometer->z;

    uint8_t *data = reinterpret_cast<uint8_t *>(&message);
    this->_network_client.send(data, sizeof(message));
}

bool RocketClient::update()
{
    uint32_t now = millis();

    // check if the timer expired for the status message
    uint32_t delta = now - this->_status_message_timer;
    if (delta > this->_config->status_message_update)
    {
        // send the status message
        this->send_status();
        // reset the timer
        this->_status_message_timer = now;
    }

    // check if the timer expired for the telemetry message
    delta = now - this->_telemetry_message_timer;
    if (delta > this->_config->telemetry_message_update)
    {
        // send the status message
        this->send_telemetry();
        // reset the timer
        this->_telemetry_message_timer = now;
    }

    // update the network client
    this->_network_client.update();

    return true;
}