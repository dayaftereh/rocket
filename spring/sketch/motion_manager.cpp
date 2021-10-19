#include "motion_manager.h"

MotionManager::MotionManager() {

}

bool MotionManager::setup() {  
  this->_mpu6050 = new MPU6050(0x68);

  // start up the MPU6050
  this->_mpu6050->initialize();

  // test the connectio
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

  return true;
}

void MotionManager::update() {
  // read raw accel/gyro measurements from device
  this->_mpu6050->getMotion6(
    &this->_ax, &this->_ay, &this->_az,
    &this->_gx, &this->_gy, &this->_gz
  );

}
