#include "motion_manager.h"

MotionManager::MotionManager()
{
}

bool MotionManager::setup(Config *config, Stats *stats, StatusLeds *status_leds)
{
  this->_stats = stats;
  this->_config = config;
  this->_status_leds = status_leds;

  this->_wire = &Wire;
  this->_mpu6050_address = MPU6050_I2C_ADDRESS;
  this->_hmc5883l_address = HMC5883L_I2C_ADDRESS;

  bool success = this->_madgwick.setup(config);
  if (!success)
  {
    Serial.println("fail to initialize madgwick");
    return false;
  }

  success = this->init_mpu6050();
  if (!success)
  {
    Serial.println("fail to initialize mpu6050");
    return false;
  }

  delay(10);

  this->_status_leds->progress();

  success = this->init_hmc5883l();
  if (!success)
  {
    Serial.println("fail to initialize hmc5883l");
    return false;
  }

  this->_status_leds->progress();

  // Wait for sensor to stabilize
  delay(100);

  this->_status_leds->progress();

  success = this->initialize();
  if (!success)
  {
    Serial.println("fail to initialize starting angle");
    return false;
  }

  this->_status_leds->progress();

  return true;
}

bool MotionManager::init_mpu6050()
{
  // setup the mpu6050
  bool success = this->write_mpu6050_data(MPU6050_PWR_MGMT_1_REGISTER, 0x01); // PLL with X axis gyroscope reference and disable sleep mode
  if (!success)
  {
    Serial.println("fail to communicate with the mpu6050");
    return false;
  }

  success = this->write_mpu6050_data(MPU6050_SMPLRT_DIV_REGISTER, 0); // Set the sample rate to 1000Hz - 8kHz/(7+1) = 1000Hz
  if (!success)
  {
    Serial.println("fail to set the sample rate of the mpu6050");
    return false;
  }

  success = this->write_mpu6050_data(MPU6050_CONFIG_REGISTER, 0x00); // Disable FSYNC and set 260 Hz Acc filtering, 256 Hz Gyro filtering, 8 KHz sampling
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

  this->_status_leds->progress();

  delay(10);

  this->_status_leds->progress();

  success = calibrate_mpu6050();
  if (!success)
  {
    Serial.println("fail to calibrate mpu6050");
    return false;
  }

  return true;
}

bool MotionManager::init_hmc5883l()
{
  // Configure device for continuous mode
  bool success = this->write_hmc5883l_data(0x0B, 0x01);
  if (!success)
  {
    Serial.println("fail to communicate and setup hmc5883l");
    return false;
  }

  this->_magnetometer_2_gauss = 3000.0;

  // Configure device for continuous mode
  success = this->write_hmc5883l_data(0x09, 0b00000001 | 0b00001100 | 0b00010000 | 0b00000000);
  if (!success)
  {
    Serial.println("fail to setup hmc5883l");
    return false;
  }

  success = this->calibrate_magnetometer();
  if (!success)
  {
    Serial.println("fail to calibrate hmc5883l");
    return false;
  }

  return true;
}

bool MotionManager::write_data(byte addr, byte reg, byte data)
{
  this->_wire->beginTransmission(addr);

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

bool MotionManager::write_mpu6050_data(byte reg, byte data)
{
  bool success = this->write_data(this->_mpu6050_address, reg, data);
  return success;
}

bool MotionManager::write_hmc5883l_data(byte reg, byte data)
{
  bool success = this->write_data(this->_hmc5883l_address, reg, data);
  return success;
}




bool MotionManager::calibrate_magnetometer()
{
  /*
    bool success = this->write_hmc5883l_data(0x00, 0x11);
    if (!success)
    {
    Serial.println("fail to set magnetometer to read positive bias");
    return false;
    }

    this->_status_leds->progress();

    // Wait for sensor to get ready
    delay(100);

    this->_status_leds->progress();

    // Read positive bias values
    success = this->update_hmc5883l();
    if (!success)
    {
    Serial.println("fail to update magnetometer on the first read");
    return false;
    }
    Vec3f positiv_offset = this->_raw_magnetometer.clone();

    success = this->write_hmc5883l_data(0x00, 0x12);
    if (!success)
    {
    Serial.println("fail to set magnetometer to read negativ bias");
    return false;
    }

    this->_status_leds->progress();

    // Wait for sensor to get ready
    delay(100);

    this->_status_leds->progress();

    // Read negative bias values
    success = this->update_hmc5883l();
    if (!success)
    {
    Serial.println("fail to update magnetometer on the second read");
    return false;
    }
    Vec3f negativ_offset = this->_raw_magnetometer.clone();

  */

  // Back to normal
  bool success = this->write_hmc5883l_data(0x00, 0x10);
  if (!success)
  {
    Serial.println("fail to set magnetometer back to normal reading");
    return false;
  }

  this->_status_leds->progress();

  delay(100); // Wait for sensor to get back to normal

  this->_status_leds->progress();

  /*

    this->_gain_magnetometer.x = -2500.0 / (negativ_offset.x - positiv_offset.x);
    this->_gain_magnetometer.y = -2500.0 / (negativ_offset.y - positiv_offset.y);
    this->_gain_magnetometer.z = -2500.0 / (negativ_offset.z - positiv_offset.z);*/

  this->_gain_magnetometer.x = 1.0;
  this->_gain_magnetometer.y = 1.0;
  this->_gain_magnetometer.z = 1.0;

  Serial.print("magnetometer gain [ x: ");
  Serial.print(this->_gain_magnetometer.x, 4);
  Serial.print(", y: ");
  Serial.print(this->_gain_magnetometer.y, 4);
  Serial.print(", z: ");
  Serial.print(this->_gain_magnetometer.z, 4);
  Serial.println(" ]");

  return true;
}

bool MotionManager::initialize()
{
  bool success = this->update_mpu6050();
  if (!success)
  {
    Serial.println("fail to update mpu6050 for initializing starting angle");
    return false;
  }

  success = this->update_hmc5883l();
  if (!success)
  {
    Serial.println("fail to update hmc5883l for initializing starting angle");
    return false;
  }

  return true;
}

bool MotionManager::update_hmc5883l()
{
  this->_wire->beginTransmission(this->_hmc5883l_address);
  this->_wire->write(0x00);
  this->_wire->endTransmission(false);

  // require 7
  uint8_t length = 7;

  // request the magnetometer values from hmc58831
  int received = this->_wire->requestFrom(this->_hmc5883l_address, length);
  if (received != length)
  {
    return false;
  }

  int16_t raw_magnetometer_x = this->_wire->read() | (this->_wire->read() << 8);
  int16_t raw_magnetometer_y = this->_wire->read() | (this->_wire->read() << 8);
  int16_t raw_magnetometer_z = this->_wire->read() | (this->_wire->read() << 8);

  this->_raw_magnetometer.x = (float)raw_magnetometer_x;
  this->_raw_magnetometer.y = (float)raw_magnetometer_y;
  this->_raw_magnetometer.z = (float)raw_magnetometer_z;

  byte overflow = this->_wire->read() & 0x02;

  /*Serial.print("_raw_magnetometer [ x: ");
  Serial.print(this->_raw_magnetometer.x, 4);
  Serial.print(", y: ");
  Serial.print(this->_raw_magnetometer.y, 4);
  Serial.print(", z: ");
  Serial.print(this->_raw_magnetometer.z, 4);
  Serial.println(" ]");*/

  bool success = (overflow << 2) == 0;
  return success;
}

bool MotionManager::update_mpu6050()
{
  this->_wire->beginTransmission(this->_mpu6050_address);
  this->_wire->write(MPU6050_ACCELERATION_OUT_REGISTER);
  this->_wire->endTransmission(false);

  // require 14
  uint8_t length = 14;

  // request the bytes from mpu650
  int received = this->_wire->requestFrom(this->_mpu6050_address, length);
  if (received != length)
  {
    return false;
  }

  // [ax,ay,az,temp,gx,gy,gz]
  int16_t raw_acceleration_x = (this->_wire->read() << 8) | this->_wire->read();
  int16_t raw_acceleration_y = (this->_wire->read() << 8) | this->_wire->read();
  int16_t raw_acceleration_z = (this->_wire->read() << 8) | this->_wire->read();

  int16_t raw_temperature = (this->_wire->read() << 8) | this->_wire->read();

  int16_t raw_gyroscope_x = (this->_wire->read() << 8) | this->_wire->read();
  int16_t raw_gyroscope_y = (this->_wire->read() << 8) | this->_wire->read();
  int16_t raw_gyroscope_z = (this->_wire->read() << 8) | this->_wire->read();

  this->_raw_acceleration.x = (float)raw_acceleration_x;
  this->_raw_acceleration.y = (float)raw_acceleration_y;
  this->_raw_acceleration.z = (float)raw_acceleration_z;

  this->_raw_temperature = (float)raw_temperature;

  this->_raw_gyroscope.x = (float)raw_gyroscope_x;
  this->_raw_gyroscope.y = (float)raw_gyroscope_y;
  this->_raw_gyroscope.z = (float)raw_gyroscope_z;

  return true;
}

void MotionManager::update()
{
  /* Update all the IMU values */
  this->update_mpu6050();
  this->update_hmc5883l();
  this->update_acceleration_gyroscope();
}

void MotionManager::update_acceleration_gyroscope_magnetometer()
{
  this->_gyroscope.x = (this->_raw_gyroscope.x + this->_gyroscope_offset.x) / this->_gyroscope_2_deg; // Convert to deg/s
  this->_gyroscope.y = (this->_raw_gyroscope.y + this->_gyroscope_offset.y) / this->_gyroscope_2_deg; // Convert to deg/s
  this->_gyroscope.z = (this->_raw_gyroscope.z + this->_gyroscope_offset.z) / this->_gyroscope_2_deg; // Convert to deg/s

  this->_acceleration.x = ((this->_raw_acceleration.x + this->_acceleration_offset.x) / this->_acceleration_2_g) * GRAVITY_OF_EARTH; // Convert to m/s2
  this->_acceleration.y = ((this->_raw_acceleration.y + this->_acceleration_offset.y) / this->_acceleration_2_g) * GRAVITY_OF_EARTH; // Convert to m/s2
  this->_acceleration.z = ((this->_raw_acceleration.z + this->_acceleration_offset.z) / this->_acceleration_2_g) * GRAVITY_OF_EARTH; // Convert to m/s2

  this->_magnetometer.x = this->_raw_magnetometer.x / this->_magnetometer_2_gauss;
  this->_magnetometer.y = this->_raw_magnetometer.y / this->_magnetometer_2_gauss;
  this->_magnetometer.z = this->_raw_magnetometer.z / this->_magnetometer_2_gauss;
}

Vec3f *MotionManager::get_magnetometer()
{
  return &this->_magnetometer;
}

Vec3f *MotionManager::get_gyroscope()
{
  return &this->_gyroscope;
}

Vec3f *MotionManager::get_acceleration()
{
  return &this->_acceleration;
}
