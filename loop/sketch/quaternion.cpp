#include "quaternion.h"

Quaternion::Quaternion()
{
  this->x = 0.0;
  this->y = 0.0;
  this->z = 0.0;
  this->w = 1.0;
}

Quaternion::Quaternion(float x, float y, float z, float w)
{
  this->x = x;
  this->y = y;
  this->z = z;
  this->w = w;
}

Quaternion Quaternion::clone()
{
  Quaternion q(this->x, this->y, this->z, this->w);
  return q;
}

Quaternion Quaternion::inverse() {

  Quaternion q(this->x * -1.0, this->y * -1.0, this->z * -1.0, this->w);
  return q;
}

void Quaternion::set_euler(float x, float y, float z)
{

  float c1 = cos(x / 2.0);
  float c2 = cos(y / 2.0);
  float c3 = cos(z / 2.0);

  float s1 = sin(x / 2.0);
  float s2 = sin(y / 2.0);
  float s3 = sin(z / 2.0);

  // xyz
  this->x = s1 * c2 * c3 + c1 * s2 * s3;
  this->y = c1 * s2 * c3 - s1 * c2 * s3;
  this->z = c1 * c2 * s3 + s1 * s2 * c3;
  this->w = c1 * c2 * c3 - s1 * s2 * s3;
}

Quaternion Quaternion::multiply(Quaternion &q)
{
  float qax = this->x;
  float qay = this->y;
  float qaz = this->z;
  float qaw = this->w;

  float qbx = q.x;
  float qby = q.y;
  float qbz = q.z;
  float qbw = q.w;

  Quaternion result(
    qax * qbw + qaw * qbx + qay * qbz - qaz * qby,
    qay * qbw + qaw * qby + qaz * qbx - qax * qbz,
    qaz * qbw + qaw * qbz + qax * qby - qay * qbx,
    qaw * qbw - qax * qbx - qay * qby - qaz * qbz);

  return result;
}

Vec3f Quaternion::multiply_vec(Vec3f &v)
{
  float x = v.x;
  float y = v.y;
  float z = v.z;

  float qx = this->x;
  float qy = this->y;
  float qz = this->z;
  float qw = this->w;

  // calculate quat * vector
  float ix = qw * x + qy * z - qz * y;
  float iy = qw * y + qz * x - qx * z;
  float iz = qw * z + qx * y - qy * x;
  float iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  float dx = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  float dy = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  float dz = iz * qw + iw * -qz + ix * -qy - iy * -qx;

  Vec3f result(dx, dy, dz);

  return result;
}

Vec3f Quaternion::get_euler()
{
  Vec3f euler;

  // roll (x-axis rotation)
  float sinr_cosp = 2.0 * (this->w * this->x + this->y * this->z);
  float cosr_cosp = 1.0 - 2.0 * (this->x * this->x + this->y * this->y);
  euler.x = atan2(sinr_cosp, cosr_cosp);

  // pitch (y-axis rotation)
  double sinp = 2.0 * (this->w * this->y - this->z * this->x);
  if (abs(sinp) >= 1.0)
  {
    euler.y = copysign(PI / 2.0, sinp); // use 90 degrees if out of range;
  }
  else
  {
    euler.y = asin(sinp);
  }

  // yaw (z-axis rotation)
  double siny_cosp = 2.0 * (this->w * this->z + this->x * this->y);
  double cosy_cosp = 1 - 2 * (this->y * this->y + this->z * this->z);
  euler.z = atan2(siny_cosp, cosy_cosp);

  return euler;
}
