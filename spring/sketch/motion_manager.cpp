#include "motion_manager.h"

MotionManager::MotionManager() {

}

bool MotionManager::setup(Config *config, Stats *stats, StatusLeds *status_leds) {
  this->_stats = stats;
  this->_config = config;
  this->_status_leds = status_leds;
  this->_mpu6050 = new MPU6050(0x68);

  // start up the MPU6050
  this->_mpu6050->initialize();

  // test the connection with mpu6050
  bool success = this->_mpu6050->testConnection();
  if (!success) {
    Serial.println("Fail to connect with MPU6050!");
    return false;
  }

  int deviceID = this->_mpu6050->getDeviceID();
  // output info about MPU6050 sensor
  Serial.print("Connected with MPU6050 [ id:");
  Serial.print(deviceID);
  Serial.println(" ]");

  this->warmup();

  return true;
}

void MotionManager::warmup() {
  unsigned long elapsed = 0;
  unsigned long start = millis();

  // warm the MPU6050 up
  Serial.println("warming up the MPU6050 ...");
  while (elapsed < MOTION_MANAGER_WARM_UP_TIMEOUT) {
    elapsed = millis() - start;
    this->_status_leds->progress();
    // read the motion
    this->read();
  }
}

void MotionManager::update() {
  // read from the mpu6050
  this->read();
  // update the world orientation
  this->update_world_orientation();

  this->update_world_rotation();
}

void MotionManager::update_world_orientation() {
  // get the elapsed time
  float t = this->_stats->get_delta();
  float deg2rad = PI / 180.0;

  // check if some thing changed
  float length = this->_gyroscope.getMagnitude();
  if (length < this->_config->motion_detection_threshold) {
    return;
  }

  // calulcate angle changed
  VectorFloat v;
  v.x = (this->_gyroscope.x * deg2rad) * t;
  v.y = (this->_gyroscope.y * deg2rad) * t;
  v.z = (this->_gyroscope.z * deg2rad) * t;

  float c1 = cos(v.x / 2.0);
  float c2 = cos(v.y / 2.0);
  float c3 = cos(v.z / 2.0);

  float s1 = sin(v.x / 2.0);
  float s2 = sin(v.y / 2.0);
  float s3 = sin(v.z / 2.0);

  Quaternion q;
  q.x = s1 * c2 * c3 + c1 * s2 * s3;
  q.y = c1 * s2 * c3 - s1 * c2 * s3;
  q.z = c1 * c2 * s3 + s1 * s2 * c3;
  q.w = c1 * c2 * c3 - s1 * s2 * s3;

  this->_world_orientation = this->_world_orientation.getProduct(q);
}

void MotionManager::update_world_rotation() {
  Quaternion *q = this->get_world_orientation();

  // compute euler angles
  float psi = atan2(2.0 * q -> x * q -> y - 2.0 * q -> w * q -> z, 2.0 * q -> w * q -> w + 2.0 * q -> x * q -> x - 1.0); // psi
  float theta = -asin(2.0 * q -> x * q -> z + 2.0 * q -> w * q -> y);                                                     // theta
  float phi = atan2(2.0 * q -> y * q -> z - 2.0 * q -> w * q -> x, 2.0 * q -> w * q -> w + 2.0 * q -> z * q -> z - 1.0); // phi

  float rad2deg = 180.0 / PI;
  // set the new world roation
  this->_world_rotaion.x = psi * rad2deg;
  this->_world_rotaion.y = theta * rad2deg;
  this->_world_rotaion.z = phi * rad2deg;
}

void MotionManager::read() {
  int16_t ax, ay, az, gx, gy, gz;
  // read raw accel/gyro measurements from device
  this->_mpu6050->getMotion6(
    &ax, &ay, &az,
    &gx, &gy, &gz
  );

  // get the scaling
  float gyroscope_scale = this->get_gyroscope_scale();
  float acceleromete_scale = this->get_acceleromete_scale();

  // compute the acceleration for x,y, and z in m/s2
  this->_acceleration.x = ((((float)ax) / acceleromete_scale) * GRAVITY_OF_EARTH) + this->_config->acceleration_x_offset;
  this->_acceleration.y = ((((float)ay) / acceleromete_scale) * GRAVITY_OF_EARTH) + this->_config->acceleration_y_offset;
  this->_acceleration.z = ((((float)az) / acceleromete_scale) * GRAVITY_OF_EARTH) + this->_config->acceleration_z_offset;

  // compute the gyroscope for x,y, and z in deg/s
  this->_gyroscope.x = (((float)gx) / gyroscope_scale) + this->_config->gyroscope_x_offset;
  this->_gyroscope.y = (((float)gy) / gyroscope_scale) + this->_config->gyroscope_y_offset;
  this->_gyroscope.z = (((float)gz) / gyroscope_scale) + this->_config->gyroscope_z_offset;
}

float MotionManager::get_gyroscope_scale() {
  /**
     FS_SEL | Full Scale Range   | LSB Sensitivity
    -------+--------------------+----------------
    0      | +/- 250 degrees/s  | 131 LSB/deg/s
    1      | +/- 500 degrees/s  | 65.5 LSB/deg/s
    2      | +/- 1000 degrees/s | 32.8 LSB/deg/s
    3      | +/- 2000 degrees/s | 16.4 LSB/deg/s
  */

  int gyro_range = this->_mpu6050->getFullScaleGyroRange();

  if (gyro_range == 0) {
    return 131.0;
  }
  if (gyro_range == 1) {
    return 65.5;
  }
  if (gyro_range == 2) {
    return 32.8;
  }
  if (gyro_range == 3) {
    return 16.4;
  }

  return 1.0;
}

float MotionManager::get_acceleromete_scale() {
  /**
     AFS_SEL | Full Scale Range | LSB Sensitivity
    --------+------------------+----------------
    0       | +/- 2g           | 8192 LSB/mg
    1       | +/- 4g           | 4096 LSB/mg
    2       | +/- 8g           | 2048 LSB/mg
    3       | +/- 16g          | 1024 LSB/mg
  */

  int accel_range = this->_mpu6050->getFullScaleAccelRange();

  if (accel_range == 3) {
    return  2048.0;
  }
  if (accel_range == 2) {
    return 4096.0;
  }
  if (accel_range == 1) {
    return 8192.0;
  }
  if (accel_range == 0) {
    return 16384.0;
  }

  return 1.0;
}

VectorFloat *MotionManager::get_gyroscope() {
  return &this->_gyroscope;
}

VectorFloat *MotionManager::get_acceleration() {
  return &this->_acceleration;
}

Quaternion *MotionManager::get_world_orientation() {
  return &this->_world_orientation;
}

VectorFloat *MotionManager::get_world_rotaion() {
  return &this->_world_rotaion;
}
