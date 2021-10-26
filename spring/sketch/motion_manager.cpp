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

  // setup the mpu6050
  byte status = this->write_data(MPU6050_PWR_MGMT_1_REGISTER, 0x01); // check only the first connection with status
  // check for success
  if (status != 0)
  {
    Serial.println("fail to communicate with the mpu6050");
    return false;
  }

  this->writeData(MPU6050_SMPLRT_DIV_REGISTER, 0x00);
  this->writeData(MPU6050_CONFIG_REGISTER, 0x00);

  bool success = this->set_gyroscope_config(MPU6050_GYROSCOPE_250_DEG);
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
  // read the first data
  success = this->read();
  {
    Serial.println("fail to read the first data from mpu6050");
    return false;
  }

  success = this->initialize()
  {
    Serial.println("fail to initialize mpu6050");
    return false;
  }

  return true;
}

byte MotionManager::write_data(byte register, byte data)
{
  this->_wire->beginTransmission(this->_address);

  this->_wire->write(register);
  this->_wire->write(data);

  byte status = this->_wire->endTransmission();
  return status; // 0 if success
}

bool MotionManager::set_gyroscope_config(MPU6050GyroscopeConfig config_num)
{
  byte status = 1;
  switch (config_num)
  {
  case MPU6050_GYROSCOPE_250_DEG: // range = +- 250 deg/s
    this->_gyroscope_2_deg = 131.0;
    status = writeData(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_GYROSCOPE_500_DEG: // range = +- 500 deg/s
    this->_gyroscope_2_deg = 65.5;
    status = writeData(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_GYROSCOPE_1000_DEG: // range = +- 1000 deg/s
    this->_gyroscope_2_deg = 32.8;
    status = writeData(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_GYROSCOPE_2000_DEG: // range = +- 2000 deg/s
    this->_gyroscope_2_deg = 16.4;
    status = writeData(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
    break;
  }

  return status == 0;
}
bool MotionManager::set_acceleration_config(MPU6050AccelerationConfig config_num)
{
  byte status = 1;
  switch (config_num)
  {
  case MPU6050_ACCELERATION_2_G: // range = +- 2 g
    this->_acceleration_2_g = 16384.0;
    status = writeData(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_ACCELERATION_4_G: // range = +- 4 g
    this->_acceleration_2_g = 8192.0;
    status = writeData(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_ACCELERATION_8_G: // range = +- 8 g
    this->_acceleration_2_g = 4096.0;
    status = writeData(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
    break;
  case MPU6050_ACCELERATION_16_G: // range = +- 16 g
    this->_acceleration_2_g = 2048.0;
    status = writeData(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
    break;
  }

  return status == 0;
}

bool MotionManager::initialize()
{
  Vec3f gyroscope;
  Vec3f acceleration;

  for (size_t i = 0; i < MOTION_MANAGER_CALIBRATION_READS; i++)
  {
    // read some data
    bool success = this->read();
    if (!success)
    {
      Serial.println("read error while calibration values of mpu6050");
      return false;
    }

    // sum up the read values
    gyroscope = gyroscope.add(this->_gyroscope);
    acceleration = acceleration.add(this->_acceleration);

    // delay for the next read
    delay(1);
  }

  gyroscope = gyroscope.divide_scalar(MOTION_MANAGER_CALIBRATION_READS);
  acceleration = acceleration.divide_scalar(MOTION_MANAGER_CALIBRATION_READS);

  // calculate the offset for gyroscope
  this->_gyroscope_offset = gyroscope.invert();
  // calculate the offset for acceleration
  this->_acceleration_offset = acceleration.invert();

  Serial.print("mpu6050 gyroscope [ x: ");
  Serial.print(this->_gyroscope_offset.x, 4);
  Serial.print(", y: ");
  Serial.print(this->_gyroscope_offset.y, 4);
  Serial.print(", z: ");
  Serial.print(this->_gyroscope_offset.z, 4);
  Serial.println(" ]");

  Serial.print("mpu6050 acceleration [ x: ");
  Serial.print(this->_acceleration_offset.x, 4);
  Serial.print(", y: ");
  Serial.print(this->_acceleration_offset.y, 4);
  Serial.print(", z: ");
  Serial.print(this->_acceleration_offset.z, 4);
  Serial.println(" ]");

  // get the gravity direction
  this->_gravity = acceleration.normalize();

  Serial.print("mpu6050 gravity direction [ x: ");
  Serial.print(this->_gravity.x, 4);
  Serial.print(", y: ");
  Serial.print(this->_gravity.y, 4);
  Serial.print(", z: ");
  Serial.print(this->_gravity.z, 4);
  Serial.println(" ]");

  return true;
}

bool MotionManager::read()
{
  this->_wire->beginTransmission(this->_address);
  this->_wire->write(MPU6050_ACCELERATION_OUT_REGISTER);
  this->_wire->endTransmission(false);

  // [ax,ay,az,temp,gx,gy,gz]
  this->_wire->requestFrom(this->_address, (uint8_t)14);

  // read the raw values from wire
  int16_t raw_acceleration_x = (this->_wire->read() << 8) | this->_wire->read();
  int16_t raw_acceleration_y = (this->_wire->read() << 8) | this->_wire->read();
  int16_t raw_acceleration_z = (this->_wire->read() << 8) | this->_wire->read();

  int16_t raw_temperature = (this->_wire->read() << 8) | this->_wire->read();

  int16_t raw_gyroscope_x = (this->_wire->read() << 8) | this->_wire->read();
  int16_t raw_gyroscope_y = (this->_wire->read() << 8) | this->_wire->read();
  int16_t raw_gyroscope_z = (this->_wire->read() << 8) | this->_wire->read();

  // compute the acceleration
  this->_acceleration.x = (((float)raw_acceleration_x) / this->_acceleration_2_g) - this->_acceleration_offset.x;
  this->_acceleration.y = (((float)raw_acceleration_y) / this->_acceleration_2_g) - this->_acceleration_offset.y;
  this->_acceleration.z = (((float)raw_acceleration_z) / this->_acceleration_2_g) - this->_acceleration_offset.z;

  // compute the gyroscope
  this->_gyroscope.x = (((float)raw_gyroscope_x) / this->_gyroscope_2_deg) - this->_gyroscope_offset.x;
  this->_gyroscope.y = (((float)raw_gyroscope_y) / this->_gyroscope_2_deg) - this->_gyroscope_offset.y;
  this->_gyroscope.z = (((float)raw_gyroscope_z) / this->_gyroscope_2_deg) - this->_gyroscope_offset.z;

  return true;
}

void MotionManager::update_rotation()
{
  float angle_acceleration_x = atan2(accY, sgZ * sqrt(accZ * accZ + accX * accX)) * RAD_2_DEG; // [-180,+180] deg
  float angle_acceleration_y = -atan2(accX, sqrt(accZ * accZ + accY * accY)) * RAD_2_DEG;      // [- 90,+ 90] deg
}

void MotionManager::update()
{
}