#include "motion_manager.h"

/* Wrap an angle in the range [-limit,+limit] */
static float normalize_angle(float angle, float limit)
{
  while (angle > limit)
  {
    angle -= 2.0 * limit;
  }
  while (angle < -limit)
  {
    angle += 2.0 * limit;
  }

  return angle;
}

MotionManager::MotionManager()
{
}

bool MotionManager::setup(Config *config, Stats *stats, StatusLeds *status_leds)
{
  this->_stats = stats;
  this->_config = config;
  this->_status_leds = status_leds;

  this->_wire = &Wire;
  this->_address = MPU6050_I2C_ADDRESS;
  
  // setup the mpu6050
  byte status = this->write_data(MPU6050_PWR_MGMT_1_REGISTER, 0x01); // check only the first connection with status
  // check for success
  if (status != 0)
  {
    Serial.println("fail to communicate with the mpu6050");
    return false;
  }

  this->write_data(MPU6050_SMPLRT_DIV_REGISTER, 0x00);
  this->write_data(MPU6050_CONFIG_REGISTER, 0x00);

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
  if (!success)
  {
    Serial.println("fail to read the first data from mpu6050");
    return false;
  }

  // Wait for sensor to stabilize
  delay(100);

  success = this->initialize();
  if (!success)
  {
    Serial.println("fail to initialize mpu6050");
    return false;
  }

  return true;
}

byte MotionManager::write_data(byte reg, byte data)
{
  this->_wire->beginTransmission(this->_address);

  this->_wire->write(reg);
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
      status = this->write_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_GYROSCOPE_500_DEG: // range = +- 500 deg/s
      this->_gyroscope_2_deg = 65.5;
      status = this->write_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_GYROSCOPE_1000_DEG: // range = +- 1000 deg/s
      this->_gyroscope_2_deg = 32.8;
      status = this->write_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_GYROSCOPE_2000_DEG: // range = +- 2000 deg/s
      this->_gyroscope_2_deg = 16.4;
      status = this->write_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
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
      status = this->write_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_ACCELERATION_4_G: // range = +- 4 g
      this->_acceleration_2_g = 8192.0;
      status = this->write_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_ACCELERATION_8_G: // range = +- 8 g
      this->_acceleration_2_g = 4096.0;
      status = this->write_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_ACCELERATION_16_G: // range = +- 16 g
      this->_acceleration_2_g = 2048.0;
      status = this->write_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
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
      Serial.println("read error while calibrating mpu6050");
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
  //this->_gyroscope_offset = gyroscope.invert();
  // calculate the offset for acceleration
  //this->_acceleration_offset = acceleration.invert();

  Serial.print("mpu6050 gyroscope offset [ x: ");
  Serial.print(this->_gyroscope_offset.x, 4);
  Serial.print(", y: ");
  Serial.print(this->_gyroscope_offset.y, 4);
  Serial.print(", z: ");
  Serial.print(this->_gyroscope_offset.z, 4);
  Serial.println(" ]");

  Serial.print("mpu6050 acceleration offset [ x: ");
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
  this->_acceleration.x = ((((float)raw_acceleration_x) / this->_acceleration_2_g) * GRAVITY_OF_EARTH) - this->_acceleration_offset.x;
  this->_acceleration.y = ((((float)raw_acceleration_y) / this->_acceleration_2_g) * GRAVITY_OF_EARTH) - this->_acceleration_offset.y;
  this->_acceleration.z = ((((float)raw_acceleration_z) / this->_acceleration_2_g) * GRAVITY_OF_EARTH) - this->_acceleration_offset.z;

  // compute the gyroscope
  this->_gyroscope.x = (((float)raw_gyroscope_x) / this->_gyroscope_2_deg) - this->_gyroscope_offset.x;
  this->_gyroscope.y = (((float)raw_gyroscope_y) / this->_gyroscope_2_deg) - this->_gyroscope_offset.y;
  this->_gyroscope.z = (((float)raw_gyroscope_z) / this->_gyroscope_2_deg) - this->_gyroscope_offset.z;

  return true;
}

void MotionManager::update_rotation()
{
  float sgZ = (this->_acceleration.z >= 0.0) - (this->_acceleration.z < 0.0);

  float angle_acceleration_x = atan2(this->_acceleration.y, sgZ * sqrt(this->_acceleration.z * this->_acceleration.z + this->_acceleration.x * this->_acceleration.x)) * RAD_2_DEG; // [-180,+180] deg
  float angle_acceleration_y = -atan2(this->_acceleration.x, sqrt(this->_acceleration.z * this->_acceleration.z + this->_acceleration.y * this->_acceleration.y)) * RAD_2_DEG;     // [- 90,+ 90] deg

  float dt = this->_stats->get_delta();

  float dX = this->_gyroscope.x * dt;
  float dY = this->_gyroscope.y * dt;
  float dZ = this->_gyroscope.z * dt;

  float coefficient = this->_config->gyro_acceleration_coefficient;

  this->_rotation.x = normalize_angle(
                        coefficient * (angle_acceleration_x + normalize_angle(
                              this->_rotation.x + dX - angle_acceleration_x,
                              180.0)) +
                        (1.0 - coefficient) * angle_acceleration_x,
                        180.0);

  this->_rotation.y = normalize_angle(
                        coefficient * (angle_acceleration_y + normalize_angle(
                              this->_rotation.y + sgZ * dY - angle_acceleration_y,
                              90.0)) +
                        (1.0 - coefficient) * angle_acceleration_y,
                        90.0);

  this->_rotation.z = 0.0;
}

void MotionManager::update()
{
  bool success = this->read();
  if (!success)
  {
    return;
  }

  this->update_rotation();
}

Vec3f *MotionManager::get_rotation()
{
  return &this->_rotation;
}

Vec3f *MotionManager::get_gyroscope()
{
  return &this->_gyroscope;
}

Vec3f *MotionManager::get_acceleration()
{
  return &this->_acceleration;
}
