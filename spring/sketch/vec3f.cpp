#include "vec3f.h"

Vec3f::Vec3f()
{
    this->x = 0.0;
    this->y = 0.0;
    this->z = 0.0;
}

Vec3f::Vec3f(float x, float y, float z)
{
    this->x = x;
    this->y = y;
    this->z = z;
}

Vec3f Vec3f::scale_scalar(float s)
{
    Vec3f v(this->x * s, this->y * s, this->z * s);
    return v;
}

Vec3f Vec3f::invert()
{
    Vec3f v(this->x * -1.0, this->y * -1.0, this->z * -1.0);
    return v;
}

Vec3f Vec3f::divide_scalar(float s)
{
    Vec3f v(this->x / s, this->y / s, this->z / s);
    return v;
}

Vec3f Vec3f::add(Vec3f &v)
{
    Vec3f v(this->x + v.x, this->y + v.y, this->z + v.z);
    return v;
}

float Vec3f::length()
{
    float ls = this->length_squared();
    return sqrt(ls);
}

float Vec3f::length_squared()
{
    return (this->x * this->x) + (this->y * this->y) + (this->z * this->z);
}

Vec3f Vec3f::normalize()
{
    float l = this->length();
    if (l < VEC_3F_LEN_ZERO_EPSILON)
    {
        return Vec3f();
    }

    return this->divide_scalar(l);
}