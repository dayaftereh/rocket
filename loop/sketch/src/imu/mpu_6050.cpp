#include "mpu_6050.h"

MPU6050::MPU6050()
{
}

bool MPU6050::setup(Config *config, TwoWire *wire, LEDs *leds)
{
  this->_leds = leds;
  this->_wire = wire;
  this->_config = config;

  // Initialize
  this->_address = MPU6050_I2C_ADDRESS;

  // setup the mpu6050
  bool success = this->write_data(MPU6050_PWR_MGMT_1_REGISTER, 0x01); // PLL with X axis gyroscope reference and disable sleep mode
  if (!success)
  {
    Serial.println("fail to communicate with the mpu6050");
    return false;
  }

  success = this->write_data(MPU6050_SMPLRT_DIV_REGISTER, 0); // Set the sample rate to 1000Hz - 8kHz/(7+1) = 1000Hz
  if (!success)
  {
    Serial.println("fail to set the sample rate of the mpu6050");
    return false;
  }

  success = this->write_data(MPU6050_CONFIG_REGISTER, 0x00); // Disable FSYNC and set 260 Hz Acc filtering, 256 Hz Gyro filtering, 8 KHz sampling
  if (!success)
  {
    Serial.println("fail to disable FSYNC on the mpu6050");
    return false;
  }

  success = this->set_gyroscope_config(MPU6050_GYROSCOPE_250_DEG);
  if (!success)
  {
    Serial.println("fail to configure mpu6050 gyroscope config");
    return false;
  }

  success = this->set_acceleration_config(MPU6050_ACCELERATION_2_G);
  if (!success)
  {
    Serial.println("fail to configure mpu6050 acceleration config");
    return false;
  }

  this->_leds->sleep(10);

  success = this->calibrate();
  if (!success)
  {
    Serial.println("fail to calibrate mpu6050");
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

  Serial.print("gyroscope_2_degree is [ ");
  Serial.print(this->_gyroscope_2_deg, 4);
  Serial.println(" ]");

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

  Serial.print("acceleration_2_g is [ ");
  Serial.print(this->_acceleration_2_g, 4);
  Serial.println(" ]");

  return success;
}

bool MPU6050::calibrate()
{
  Serial.println("calibrating mpu6050...");

  Vec3f gyroscope_offset;
  Vec3f acceleration_offset;

  for (int i = 0; i < MOTION_MANAGER_CALIBRATION_READS; i++)
  {
    bool success = this->read();
    if (!success)
    {
      Serial.println("fail to read values for calibraten from mpu6050");
      return false;
    }

    gyroscope_offset = gyroscope_offset.add(_raw_gyroscope);
    acceleration_offset = acceleration_offset.add(_raw_acceleration);

    this->_leds->sleep(2);
  }

  this->_gyroscope_offset = gyroscope_offset.divide_scalar(MOTION_MANAGER_CALIBRATION_READS).invert();

  // calculate the scale factor
  acceleration_offset = acceleration_offset.divide_scalar(MOTION_MANAGER_CALIBRATION_READS);
  float delta = this->_acceleration_2_g / acceleration_offset.length();
  this->_acceleration_offset = acceleration_offset.scale_scalar(delta - 1.0);

  Serial.print("gyroscope_offset [ x: ");
  Serial.print(this->_gyroscope_offset.x, 4);
  Serial.print(", y: ");
  Serial.print(this->_gyroscope_offset.y, 4);
  Serial.print(", z: ");
  Serial.print(this->_gyroscope_offset.z, 4);
  Serial.println(" ]");

  Serial.print("acceleration_offset [ x: ");
  Serial.print(this->_acceleration_offset.x, 4);
  Serial.print(", y: ");
  Serial.print(this->_acceleration_offset.y, 4);
  Serial.print(", z: ");
  Serial.print(this->_acceleration_offset.z, 4);
  Serial.println(" ]");

  return true;
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
  int16_t ax = (this->_wire->read() << 8) | this->_wire->read();
  int16_t ay = (this->_wire->read() << 8) | this->_wire->read();
  int16_t az = (this->_wire->read() << 8) | this->_wire->read();

  int16_t raw_temperature = (this->_wire->read() << 8) | this->_wire->read();

  int16_t gx = (this->_wire->read() << 8) | this->_wire->read();
  int16_t gy = (this->_wire->read() << 8) | this->_wire->read();
  int16_t gz = (this->_wire->read() << 8) | this->_wire->read();

  this->_raw_acceleration.x = (float)ax;
  this->_raw_acceleration.y = (float)ay;
  this->_raw_acceleration.z = (float)az;

  this->_raw_temperature = (float)raw_temperature;

  this->_raw_gyroscope.x = (float)gx;
  this->_raw_gyroscope.y = (float)gy;
  this->_raw_gyroscope.z = (float)gz;

  return true;
}

void MPU6050::update()
{
  bool success = this->read();
  if (!success)
  {
    return;
  }

  this->_gyroscope.x = (this->_raw_gyroscope.x + this->_gyroscope_offset.x) / this->_gyroscope_2_deg; // Convert to deg/s
  this->_gyroscope.y = (this->_raw_gyroscope.y + this->_gyroscope_offset.y) / this->_gyroscope_2_deg; // Convert to deg/s
  this->_gyroscope.z = (this->_raw_gyroscope.z + this->_gyroscope_offset.z) / this->_gyroscope_2_deg; // Convert to deg/s

  this->_acceleration.x = ((this->_raw_acceleration.x + this->_acceleration_offset.x) / this->_acceleration_2_g) * GRAVITY_OF_EARTH; // Convert to m/s2
  this->_acceleration.y = ((this->_raw_acceleration.y + this->_acceleration_offset.y) / this->_acceleration_2_g) * GRAVITY_OF_EARTH; // Convert to m/s2
  this->_acceleration.z = ((this->_raw_acceleration.z + this->_acceleration_offset.z) / this->_acceleration_2_g) * GRAVITY_OF_EARTH; // Convert to m/s2
}

Vec3f *MPU6050::get_gyroscope()
{
  return &this->_gyroscope;
}

Vec3f *MPU6050::get_acceleration()
{
  return &this->_acceleration;
}
