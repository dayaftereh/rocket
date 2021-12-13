#include "qmc_5883l.h"

QMC5883L::QMC5883L()
{
}

bool QMC5883L::setup(Config *config, TwoWire *wire, LEDs *leds)
{
  this->_leds = leds;
  this->_wire = wire;
  this->_config = config;

  // Initialize
  this->_address = QMC5883L_I2C_ADDRESS;

  // Configure device for continuous mode
  bool success = this->write_data(0x0B, 0x01);
  if (!success)
  {
    Serial.println("fail to communicate and setup qmc5883l");
    return false;
  }

  success = this->configure(QMC5883L_MODE_CONTINUOUS, QMC5883L_ODR_200HZ, QMC5883L_RNG_2G, QMC5883L_OSR_512);
  if (!success)
  {
    Serial.println("fail to communicate and setup qmc5883l");
    return false;
  }

  success = this->calibrate();
  if (!success)
  {
    Serial.println("fail to calibrate qmc5883l");
    return false;
  }

  return true;
}

bool QMC5883L::write_data(byte reg, byte data)
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

bool QMC5883L::configure(QMC5883LMode mode, QMC5883LORD ord, QMC5883LRNG rnd, QMC5883LOSR osr)
{
  if (rnd == QMC5883L_RNG_2G)
  {
    this->_magnetometer_2_gauss = 3000.0;
  }
  else
  {
    this->_magnetometer_2_gauss = 1200.0;
  }

  bool success = this->write_data(0x09, mode | ord | rnd | osr);
  return success;
}

bool QMC5883L::calibrate()
{
  Serial.println("calibrating qmc5883l...");

  float max_raw = 1e12;
  float min_raw = -max_raw;


  Vec3f max_bias(min_raw, min_raw, min_raw);
  Vec3f min_bias(max_raw, max_raw, max_raw);

  for (int i = 0; i < MOTION_MANAGER_CALIBRATION_READS; i++)
  {
    bool success = this->read();
    if (!success)
    {
      Serial.println("fail to read values for calibraten from qmc5883l");
      return false;
    }

    min_bias.x = min(min_bias.x, this->_raw_magnetometer.x);
    max_bias.x = max(max_bias.x, this->_raw_magnetometer.x);

    min_bias.y = min(min_bias.y, this->_raw_magnetometer.y);
    max_bias.y = max(max_bias.y, this->_raw_magnetometer.y);

    min_bias.z = min(min_bias.z, this->_raw_magnetometer.z);
    max_bias.z = max(max_bias.z, this->_raw_magnetometer.z);

    this->_leds->sleep(2);
  }

  this->_magnetometer_offset.x = 0.0;
  this->_magnetometer_offset.y = 0.0;
  this->_magnetometer_offset.z = 0.0;

  Serial.print("magnetometer offset [ x: ");
  Serial.print(this->_magnetometer_offset.x, 4);
  Serial.print(", y: ");
  Serial.print(this->_magnetometer_offset.y, 4);
  Serial.print(", z: ");
  Serial.print(this->_magnetometer_offset.z, 4);
  Serial.println(" ]");

  return true;
}

bool QMC5883L::read()
{
  this->_wire->beginTransmission(this->_address);
  this->_wire->write(0x00);
  this->_wire->endTransmission(false);

  // require 7
  uint8_t length = 7;

  // request the magnetometer values from qmc5883l
  int received = this->_wire->requestFrom(this->_address, length);
  if (received != length)
  {
    return false;
  }

  int16_t x = this->_wire->read() | (this->_wire->read() << 8);
  int16_t y = this->_wire->read() | (this->_wire->read() << 8);
  int16_t z = this->_wire->read() | (this->_wire->read() << 8);


  this->_raw_magnetometer.x = (float)x;
  this->_raw_magnetometer.y = (float)y;
  this->_raw_magnetometer.z = (float)z;


  byte overflow = this->_wire->read() & 0x02;
  bool success = (overflow << 2) == 0;
  return success;
}

void QMC5883L::update()
{
  bool success = this->read();
  if (!success)
  {
    return;
  }

  this->_magnetometer.x = (this->_raw_magnetometer.x + this->_magnetometer_offset.x) / this->_magnetometer_2_gauss;
  this->_magnetometer.y = (this->_raw_magnetometer.y + this->_magnetometer_offset.y) / this->_magnetometer_2_gauss;
  this->_magnetometer.z = (this->_raw_magnetometer.z + this->_magnetometer_offset.z) / this->_magnetometer_2_gauss;
}

Vec3f *QMC5883L::get_magnetometer()
{
  return &this->_magnetometer;
}
