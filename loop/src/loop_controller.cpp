#include "loop_controller.h"

LoopController::LoopController() {}

bool LoopController::setup(IMU *imu, FlightComputer *flight_computer, DataLogger *data_logger, IO *io, StatusLeds *leds, Stats *stats, Print *print)
{
    this->_io = io;
    this->_imu = imu;
    this->_leds = leds;
    this->_stats = stats;
    this->_print = print;
    this->_data_logger = data_logger;
    this->_flight_computer = flight_computer;

    this->_first_update = true;
    this->_startup_timer = millis();

    return true;
}

void LoopController::locked()
{
    // check if startup timeout exceeded
    uint32_t delta = millis() - this->_startup_timer;
    if (this->_first_update || delta < LOOP_CONTROLLER_STARTUP_TIMEOUT)
    {
        return;
    }
    // bringe the flight_computer to startup
    this->_flight_computer->unlock();
}

void LoopController::startup()
{
    this->_print->println("rocket in startup");

    this->_io->off_l1();
    this->_io->off_l2();

    this->_leds->off_red();
    this->_leds->singal_red(1000);
}

void LoopController::launched()
{
    this->_leds->off_green();
    this->_leds->singal_red(250);
    this->_print->println("launched");
}

void LoopController::lift_off()
{
    this->_print->println("lift off");
}

void LoopController::meco()
{
    this->_print->println("meco");
}

void LoopController::apogee()
{
    this->_io->on_l1();

    this->_print->println("apogee");
}

void LoopController::landed()
{
    this->_print->println("landed");

    this->_io->off_l1();
    this->_io->off_l2();

    this->_leds->off_red();
    this->_leds->stop_red();
    this->_leds->singal_green(500);

    // notify data logger about done
    this->_data_logger->done();

    this->_leds->stop_green();
    this->_leds->on_green();
}

void LoopController::terminated()
{
    this->_print->println("terminated");

    this->_io->off_l1();
    this->_io->off_l2();

    this->_leds->stop_red();
    this->_leds->singal_green(500);

    // notify data logger about done
    this->_data_logger->done();

    this->_leds->on_red();
    this->_leds->stop_green();
}

void LoopController::idle()
{
}

bool LoopController::update()
{
    // check for first update
    if (this->_first_update)
    {
        this->_startup_timer = millis();
        this->_print->println("loop controller first update");
    }
    this->_first_update = false;

    bool launched = this->_flight_computer->is_launched();
    if (!launched)
    {
        return true;
    }

    bool success = this->write_data_log_entry();
    return success;
}

bool LoopController::write_data_log_entry()
{
    DataLoggerEntry entry;

    entry.elapsed = this->_stats->get_delta();

    entry.time = this->_flight_computer->get_inflight_time();
    entry.flight_computer_state = (uint16_t)this->_flight_computer->get_state();

    Quaternion *orientation = this->_imu->get_orientation();
    Vec3f rotation = orientation->get_euler().scale_scalar(RAD_TO_DEG);
    entry.rotation_x = rotation.x;
    entry.rotation_y = rotation.y;
    entry.rotation_z = rotation.z;

    Vec3f *acceleration = this->_imu->get_acceleration();
    entry.raw_acceleration_x = acceleration->x;
    entry.raw_acceleration_y = acceleration->y;
    entry.raw_acceleration_z = acceleration->z;

    Vec3f *acceleration_filtered = this->_imu->get_acceleration_filtered();
    entry.acceleration_x = acceleration_filtered->x;
    entry.acceleration_y = acceleration_filtered->y;
    entry.acceleration_z = acceleration_filtered->z;

    Vec3f *world_acceleration = this->_imu->get_world_acceleration_filtered();
    entry.world_acceleration_x = world_acceleration->x;
    entry.world_acceleration_y = world_acceleration->y;
    entry.world_acceleration_z = world_acceleration->z;

    Vec3f *zeroed_acceleration = this->_imu->get_zeroed_acceleration_filtered();
    entry.zeroed_acceleration_x = zeroed_acceleration->x;
    entry.zeroed_acceleration_y = zeroed_acceleration->y;
    entry.zeroed_acceleration_z = zeroed_acceleration->z;

    Vec3f *velocity = this->_flight_computer->get_velocity();
    entry.velocity_x = velocity->x;
    entry.velocity_y = velocity->y;
    entry.velocity_z = velocity->z;

    // get the struct as byte point
    uint8_t *data = (uint8_t *)&entry;
    // write the entry
    bool success = this->_data_logger->write(data);
    return success;
}