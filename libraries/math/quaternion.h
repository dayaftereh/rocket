#ifndef _QUATERNION_H
#define _QUATERNION_H

#include <math.h>
#include <Arduino.h>

#include "vec3f.h"

class Quaternion
{
public:
    Quaternion();
    Quaternion(float x, float y, float z, float w);

    Quaternion clone();
    Quaternion inverse();

    Vec3f get_euler();
    void set_euler(float x, float y, float z);

    Quaternion multiply(Quaternion &q);

    Vec3f multiply_vec(Vec3f &v);

    float x;
    float y;
    float z;
    float w;
};

#endif // _QUATERNION_H
