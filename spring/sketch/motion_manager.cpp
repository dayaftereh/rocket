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

  bool success = this->init_mpu6050();
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

bool MotionManager::set_gyroscope_config(MPU6050GyroscopeConfig config_num)
{
  bool success = false;
  switch (config_num)
  {
    case MPU6050_GYROSCOPE_250_DEG: // range = +- 250 deg/s
      this->_gyroscope_2_deg = 131.0;
      success = this->write_mpu6050_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_GYROSCOPE_500_DEG: // range = +- 500 deg/s
      this->_gyroscope_2_deg = 65.5;
      success = this->write_mpu6050_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_GYROSCOPE_1000_DEG: // range = +- 1000 deg/s
      this->_gyroscope_2_deg = 32.8;
      success = this->write_mpu6050_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_GYROSCOPE_2000_DEG: // range = +- 2000 deg/s
      this->_gyroscope_2_deg = 16.4;
      success = this->write_mpu6050_data(MPU6050_GYROSCOPE_CONFIG_REGISTER, config_num);
      break;
  }

  Serial.print("gyroscope_2_degree is [ ");
  Serial.print(this->_gyroscope_2_deg, 4);
  Serial.println(" ]");

  return success;
}
bool MotionManager::set_acceleration_config(MPU6050AccelerationConfig config_num)
{
  byte success = false;
  switch (config_num)
  {
    case MPU6050_ACCELERATION_2_G: // range = +- 2 g
      this->_acceleration_2_g = 16384.0;
      success = this->write_mpu6050_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_ACCELERATION_4_G: // range = +- 4 g
      this->_acceleration_2_g = 8192.0;
      success = this->write_mpu6050_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_ACCELERATION_8_G: // range = +- 8 g
      this->_acceleration_2_g = 4096.0;
      success = this->write_mpu6050_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
      break;
    case MPU6050_ACCELERATION_16_G: // range = +- 16 g
      this->_acceleration_2_g = 2048.0;
      success = this->write_mpu6050_data(MPU6050_ACCELERATION_CONFIG_REGISTER, config_num);
      break;
  }

  Serial.print("acceleration_2_g is [ ");
  Serial.print(this->_acceleration_2_g, 4);
  Serial.println(" ]");

  return success;
}

bool MotionManager::calibrate_mpu6050() {
  Vec3f gyroscope_offset;
  Vec3f acceleration_offset;

  for (int i = 0; i < MOTION_MANAGER_CALIBRATION_READS; i++) {
    this->_status_leds->progress();

    bool success = this->update_mpu6050();
    if (!success)
    {
      Serial.println("fail to read values for calibraten from mpu6050");
      return false;
    }

    gyroscope_offset = gyroscope_offset.add(_raw_gyroscope);
    acceleration_offset = acceleration_offset.add(_raw_acceleration);

    delay(2);
  }

  this->_gyroscope_offset = gyroscope_offset.divide_scalar(MOTION_MANAGER_CALIBRATION_READS).invert();
  //this->_acceleration_offset = acceleration_offset.divide_scalar(MOTION_MANAGER_CALIBRATION_READS).invert();

  Vec3f gravity(0.0, 0.0, 1.0);
  gravity = gravity.scale_scalar(this->_acceleration_2_g);
  //this->_acceleration_offset = this->_acceleration_offset.add(gravity);

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

  this->update_pitch_roll();
  this->update_yaw();

  this->_kalman_x.setAngle(this->_rotation.x);
  this->_comp_angle.x = this->_rotation.x;
  this->_gyroscope_angle.x = this->_rotation.x;

  this->_kalman_y.setAngle(this->_rotation.y);
  this->_comp_angle.y = this->_rotation.y;
  this->_gyroscope_angle.y = this->_rotation.y;

  this->_kalman_z.setAngle(this->_rotation.z);
  this->_comp_angle.z = this->_rotation.z;
  this->_gyroscope_angle.z = this->_rotation.z;

  Serial.print("initial rotation gain [ x: ");
  Serial.print(this->_rotation.x, 4);
  Serial.print(", y: ");
  Serial.print(this->_rotation.y, 4);
  Serial.print(", z: ");
  Serial.print(this->_rotation.z, 4);
  Serial.println(" ]");


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

  this->_raw_acceleration.x = (float) raw_acceleration_x;
  this->_raw_acceleration.y = (float) raw_acceleration_y;
  this->_raw_acceleration.z = (float) raw_acceleration_z;

  this->_raw_temperature = (float) raw_temperature;

  this->_raw_gyroscope.x = (float) raw_gyroscope_x;
  this->_raw_gyroscope.y = (float) raw_gyroscope_y;
  this->_raw_gyroscope.z = (float) raw_gyroscope_z;

  return true;
}

void MotionManager::update_pitch_roll()
{
  this->_rotation.x = atan(this->_raw_acceleration.y / sqrt(this->_raw_acceleration.x * this->_raw_acceleration.x + this->_raw_acceleration.z * this->_raw_acceleration.z)) * RAD_2_DEG;
  this->_rotation.y = atan2(-this->_raw_acceleration.x, this->_raw_acceleration.z) * RAD_2_DEG;
}

void MotionManager::update_yaw()
{
  Vec3f mag = this->_raw_magnetometer.clone();
  mag.x *= -1.0; // Invert axis - this it done here, as it should be done after the calibration
  mag.z *= -1.0;

  mag = mag.multiply(this->_gain_magnetometer);

  mag.x -= this->_config->magnetometer_offset_x;
  mag.y -= this->_config->magnetometer_offset_y;
  mag.z -= this->_config->magnetometer_offset_z;

  float roll_angle = this->_kalman_angle.x * DEG_2_RAD;
  float pitch_angle = this->_kalman_angle.y * DEG_2_RAD;

  float Bfy = mag.z * sin(roll_angle) - mag.y * cos(roll_angle);
  float Bfx = mag.x * cos(pitch_angle) + mag.y * sin(pitch_angle) * sin(roll_angle) + mag.z * sin(pitch_angle) * cos(roll_angle);

  float yaw = atan2(-Bfy, Bfx) * RAD_2_DEG;

  this->_rotation.z = yaw * -1.0;
}

void MotionManager::update()
{
  /* Update all the IMU values */
  this->update_mpu6050();
  this->update_hmc5883l();

  this->update_acceleration_gyroscope();

  float dt = this->_stats->get_delta();

  /* Roll and pitch estimation */
  this->update_pitch_roll();

  float gyro_x_rate = this->_gyroscope.x; //this->_raw_gyroscope.x / this->_gyroscope_2_deg; // Convert to deg/s
  float gyro_y_rate = this->_gyroscope.y; // this->_gyroscope_2_deg; // Convert to deg/s

  // This fixes the transition problem when the yaw angle jumps between -180 and 180 degrees
  if ((this->_rotation.y < -90.0 && this->_kalman_angle.y > 90.0) || (this->_rotation.y > 90.0 && this->_kalman_angle.y < -90.0))
  {
    this->_kalman_y.setAngle(this->_rotation.y);
    this->_comp_angle.y = this->_rotation.y;
    this->_kalman_angle.y = this->_rotation.y;
    this->_gyroscope_angle.y = this->_rotation.y;
  }
  else
  {
    // Calculate the angle using a Kalman filter
    this->_kalman_angle.y = this->_kalman_y.getAngle(this->_rotation.y, gyro_y_rate, dt);
  }

  if (abs(this->_kalman_angle.y) > 90.0)
  {
    gyro_x_rate = -gyro_x_rate; // Invert rate, so it fits the restricted accelerometer reading
  }

  this->_kalman_angle.x = this->_kalman_x.getAngle(this->_rotation.x, gyro_x_rate, dt); // Calculate the angle using a Kalman filter

  /* Yaw estimation */
  this->update_yaw();

  float gyro_z_rate = this->_gyroscope.z; //this->_raw_gyroscope.z / this->_gyroscope_2_deg; // Convert to deg/s

  // This fixes the transition problem when the yaw angle jumps between -180 and 180 degrees
  if ((this->_rotation.z < -90 && this->_kalman_angle.z > 90.0) || (this->_rotation.z > 90.0 && this->_kalman_angle.z < -90.0))
  {
    this->_kalman_z.setAngle(this->_rotation.z);
    this->_comp_angle.z = this->_rotation.z;
    this->_kalman_angle.z = this->_rotation.z;
    this->_gyroscope_angle.z = this->_rotation.z;
  }
  else
  {
    this->_kalman_angle.z = this->_kalman_z.getAngle(this->_rotation.z, gyro_z_rate, dt); // Calculate the angle using a Kalman filter
  }

  /* Estimate angles using gyro only */
  this->_gyroscope_angle.x += gyro_x_rate * dt; // Calculate gyro angle without any filter
  this->_gyroscope_angle.y += gyro_y_rate * dt;
  this->_gyroscope_angle.z += gyro_z_rate * dt;

  float complimentary_filter = this->_config->complimentary_filter;

  /* Estimate angles using complimentary filter */
  this->_comp_angle.x = complimentary_filter * (this->_comp_angle.x + gyro_x_rate * dt) + (1.0 - complimentary_filter) * this->_rotation.x; // Calculate the angle using a Complimentary filter
  this->_comp_angle.y = complimentary_filter * (this->_comp_angle.y + gyro_y_rate * dt) + (1.0 - complimentary_filter) * this->_rotation.y;
  this->_comp_angle.z = complimentary_filter * (this->_comp_angle.z + gyro_z_rate * dt) + (1.0 - complimentary_filter) * this->_rotation.z;

  // Reset the gyro angles when they has drifted too much
  if (this->_gyroscope_angle.x < -180.0 || this->_gyroscope_angle.x > 180.0)
  {
    this->_gyroscope_angle.x = this->_kalman_angle.x;
  }

  if (this->_gyroscope_angle.y < -180.0 || this->_gyroscope_angle.y > 180.0)
  {
    this->_gyroscope_angle.y = this->_kalman_angle.y;
  }

  if (this->_gyroscope_angle.z < -180.0 || this->_gyroscope_angle.z > 180.0)
  {
    this->_gyroscope_angle.z = this->_kalman_angle.z;
  }

  /*Serial.print("_acceleration [ x: ");
    Serial.print(this->_acceleration.x, 4);
    Serial.print(", y: ");
    Serial.print(this->_acceleration.y, 4);
    Serial.print(", z: ");
    Serial.print(this->_acceleration.z, 4);
    Serial.println(" ]");*/
}

void MotionManager::update_acceleration_gyroscope()
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
