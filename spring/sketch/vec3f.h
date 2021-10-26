#ifndef _VEC_3F_H
#define _VEC_3F_H

#include <Arduino.h>

#include "config.h"

#define VEC_3F_LEN_ZERO_EPSILON 0.00001

class Vec3f
{
public:
    Vec3f();
    Vec3f(float x, float y, float z);

    Vec3f invert();
    Vec3f add(Vec3f &n);
    Vec3f scale_scalar(float s);
    Vec3f divide_scalar(float s);

    float length();
    float length_squared();

    Vec3f normalize();

    float x;
    float y;
    float z;
};

#endif // _VEC_3F_H
