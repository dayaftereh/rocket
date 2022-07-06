#include "mpu6050.h"

MPU6050::MPU6050()
{
}

bool MPU6050::setup(TwoWire *wire, Print *print, Leds *leds)
{
  this->_wire = wire;
  this->_leds = leds;
  this->_print = print;

  // Initialize
  this->_address = MPU6050_I2C_ADDRESS;

  // test the connection
  bool success = this->test_connection();
  if (!success)
  {
    this->_print->println("fail to test the connection to the mpu6050");
    return false;
  }

  // setup the mpu6050
  success = this->write_data(MPU6050_PWR_MGMT_1_REGISTER, 0x01); // PLL with X axis gyroscope reference and disable sleep mode
  if (!success)
  {
    this->_print->println("fail to communicate with the mpu6050");
    return false;
  }

  this->_leds->sleep(100);

  success = this->write_data(MPU6050_SMPLRT_DIV_REGISTER, 0); // Set the sample rate to 1000Hz - 8kHz/(7+1) = 1000Hz
  if (!success)
  {
    this->_print->println("fail to set the sample rate of the mpu6050");
    return false;
  }

  success = this->write_data(MPU6050_CONFIG_REGISTER, 0x00); // Disable FSYNC and set 260 Hz Acc filtering, 256 Hz Gyro filtering, 8 KHz sampling
  if (!success)
  {
    this->_print->println("fail to disable FSYNC on the mpu6050");
    return false;
  }

  success = this->set_gyroscope_config(MPU6050_GYROSCOPE_250_DEG);
  if (!success)
  {
    this->_print->println("fail to configure mpu6050 gyroscope config");
    return false;
  }

  success = this->set_acceleration_config(MPU6050_ACCELERATION_2_G);
  if (!success)
  {
    this->_print->println("fail to configure mpu6050 acceleration config");
    return false;
  }

  this->_leds->sleep(10);

  success = this->calibrate();
  if (!success)
  {
    this->_print->println("fail to calibrate mpu6050");
    return false;
  }

  return true;
}

bool MPU6050::write_data(byte reg, byte data)
{
  this->_wire->beginTransmission(this->_address);

  this->_wire->write(reg);
  this->_wire->write(data);

  byte status = this->_wire->endTransmission();
  /*
    0:success
    1:data too long to fit in transmit buffer
    2:received NACK on transmit of address
    3:received NACK on transmit of data
    4:other error
  */
  return status == 0;
}

bool MPU6050::set_gyroscope_config(MPU6050GyroscopeConfig config_num)
{
  bool success = false;
  switch (config_num)
  {
  case MPU6050_GYROSCOPE_250_DEG: // range = +- 250 deg/s
    this->_gyroscope_2_deg = 131.0;
    success = this->write_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_GYROSCOPE_500_DEG: // range = +- 500 deg/s
    this->_gyroscope_2_deg = 65.5;
    success = this->write_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_GYROSCOPE_1000_DEG: // range = +- 1000 deg/s
    this->_gyroscope_2_deg = 32.8;
    success = this->write_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_GYROSCOPE_2000_DEG: // range = +- 2000 deg/s
    this->_gyroscope_2_deg = 16.4;
    success = this->write_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
    break;
  }

  this->_print->print("gyroscope_2_degree is [ ");
  this->_print->print(this->_gyroscope_2_deg, 4);
  this->_print->println(" ]");

  return success;
}

bool MPU6050::set_acceleration_config(MPU6050AccelerationConfig config_num)
{
  byte success = false;
  switch (config_num)
  {
  case MPU6050_ACCELERATION_2_G: // range = +- 2 g
    this->_acceleration_2_g = 16384.0;
    success = this->write_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_ACCELERATION_4_G: // range = +- 4 g
    this->_acceleration_2_g = 8192.0;
    success = this->write_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_ACCELERATION_8_G: // range = +- 8 g
    this->_acceleration_2_g = 4096.0;
    success = this->write_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_ACCELERATION_16_G: // range = +- 16 g
    this->_acceleration_2_g = 2048.0;
    success = this->write_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
    break;
  }

  this->_print->print("acceleration_2_g is [ ");
  this->_print->print(this->_acceleration_2_g, 4);
  this->_print->println(" ]");

  return success;
}

bool MPU6050::calibrate()
{
  this->_print->println("calibrating mpu6050...");

  Vec3f gyroscope_offset;
  Vec3f acceleration_offset;

  for (int i = 0; i < MPU6050_CALIBRATION_READS; i++)
  {
    bool success = this->read();
    if (!success)
    {
      this->_print->println("fail to read values for calibraten from mpu6050");
      return false;
    }

    gyroscope_offset = gyroscope_offset.add(_raw_gyroscope);
    acceleration_offset = acceleration_offset.add(_raw_acceleration);

    this->_leds->sleep(2);
  }

  this->_gyroscope_offset = gyroscope_offset.divide_scalar(MPU6050_CALIBRATION_READS).invert();

  // calculate the scale factor
  /*acceleration_offset = acceleration_offset.divide_scalar(MPU6050_CALIBRATION_READS);
  float delta = this->_acceleration_2_g / acceleration_offset.length();
  this->_acceleration_offset = acceleration_offset.scale_scalar(delta - 1.0);*/

  this->_print->print("gyroscope_offset [ x: ");
  this->_print->print(this->_gyroscope_offset.x, 4);
  this->_print->print(", y: ");
  this->_print->print(this->_gyroscope_offset.y, 4);
  this->_print->print(", z: ");
  this->_print->print(this->_gyroscope_offset.z, 4);
  this->_print->println(" ]");

  this->_print->print("acceleration_offset [ x: ");
  this->_print->print(this->_acceleration_offset.x, 4);
  this->_print->print(", y: ");
  this->_print->print(this->_acceleration_offset.y, 4);
  this->_print->print(", z: ");
  this->_print->print(this->_acceleration_offset.z, 4);
  this->_print->println(" ]");

  return true;
}

void MPU6050::set_acceleration_offset(Vec3f &offset)
{
  this->_acceleration_offset = offset.divide_scalar(GRAVITY_OF_EARTH).scale_scalar(this->_acceleration_2_g);
}

bool MPU6050::read()
{
  this->_wire->beginTransmission(this->_address);
  this->_wire->write(MPU6050_ACCELERATION_OUT_REGISTER);
  this->_wire->endTransmission(false);

  // require 14
  uint8_t length = 14;

  // request the bytes from mpu650
  int received = this->_wire->requestFrom(this->_address, length);
  if (received != length)
  {
    return false;
  }

  // [ax,ay,az,temp,gx,gy,gz]
  int16_t ax = (((int16_t)this->_wire->read()) << 8) | this->_wire->read();
  int16_t ay = (((int16_t)this->_wire->read()) << 8) | this->_wire->read();
  int16_t az = (((int16_t)this->_wire->read()) << 8) | this->_wire->read();

  int16_t raw_temperature = (((int16_t)this->_wire->read()) << 8) | this->_wire->read();

  int16_t gx = (((int16_t)this->_wire->read()) << 8) | this->_wire->read();
  int16_t gy = (((int16_t)this->_wire->read()) << 8) | this->_wire->read();
  int16_t gz = (((int16_t)this->_wire->read()) << 8) | this->_wire->read();

  this->_raw_acceleration.x = (float)ax;
  this->_raw_acceleration.y = (float)ay;
  this->_raw_acceleration.z = (float)az;

  this->_raw_temperature = (float)raw_temperature;

  this->_raw_gyroscope.x = (float)gx;
  this->_raw_gyroscope.y = (float)gy;
  this->_raw_gyroscope.z = (float)gz;

  return true;
}

bool MPU6050::update()
{
  bool success = this->read();
  if (!success)
  {
    return false;
  }

  this->_gyroscope.x = (this->_raw_gyroscope.x + this->_gyroscope_offset.x) / this->_gyroscope_2_deg; // Convert to deg/s
  this->_gyroscope.y = (this->_raw_gyroscope.y + this->_gyroscope_offset.y) / this->_gyroscope_2_deg; // Convert to deg/s
  this->_gyroscope.z = (this->_raw_gyroscope.z + this->_gyroscope_offset.z) / this->_gyroscope_2_deg; // Convert to deg/s

  this->_acceleration.x = ((this->_raw_acceleration.x + this->_acceleration_offset.x) / this->_acceleration_2_g) * GRAVITY_OF_EARTH; // Convert to m/s2
  this->_acceleration.y = ((this->_raw_acceleration.y + this->_acceleration_offset.y) / this->_acceleration_2_g) * GRAVITY_OF_EARTH; // Convert to m/s2
  this->_acceleration.z = ((this->_raw_acceleration.z + this->_acceleration_offset.z) / this->_acceleration_2_g) * GRAVITY_OF_EARTH; // Convert to m/s2

  return true;
}

bool MPU6050::test_connection()
{
  uint8_t device_id = this->get_device_id();
  return device_id == 0x34;
}

uin8_t MPU6050::get_device_id()
{
  // reguest the who i am register
  this->_wire->beginTransmission(this->_address);
  this->_wire->write(MPU6050_WHO_AM_I_REGISTER);
  int status = this->_wire->endTransmission(false);
  if (!status != 0)
  {
    return 0;
  }

  // read the byte from wire
  int length = 1;
  int received = this->_wire->requestFrom(this->_address, length);
  if (received != length)
  {
    return 0;
  }

  // read the data
  uin8_t data = this->_wire->read();
  // get the who_i_am
  uin8_t who_i_am = data >> 1;

  return who_i_am;
}

bool MPU6050::reset()
{
  // write the reset bit
  uin8_t reset_bit = 0B10000000;
  bool success = this->write_data(MPU6050_PWR_MGMT_1_REGISTER, reset_bit);
  if (!success)
  {
    return false;
  }
  // wait 100ms
  this->_leds->sleep(100);

  // write the sensors reset bits
  reset_bit = 0B111;
  success = this->write_data(MPU6050_SINGLE_PATH_RESET_REGISTER, reset_bit);
  if (!success)
  {
    return false;
  }

  // wait 100ms
  this->_leds->sleep(100);

  // try to connect with the mpu6050 after reset
  int tries = 10;
  while (tries > 0)
  {
    // try the device connection
    bool success = test_connection();
    if (success)
    {
      return
    }

    // decriment tries
    tries--;
    // sleep
    this->_leds->sleep(10);
  }
}

Vec3f *MPU6050::get_gyroscope()
{
  return &this->_gyroscope;
}

Vec3f *MPU6050::get_acceleration()
{
  return &this->_acceleration;
}

Vec3f *MPU6050::get_raw_gyroscope()
{
  return &this->_raw_gyroscope;
}

Vec3f *MPU6050::get_raw_acceleration()
{
  return &this->_raw_acceleration;
}