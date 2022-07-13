#ifndef _ACCELERATION_H
#define _ACCELERATION_H

#include "vec3f.h"

class Acceleration
{
public:
    virtual Vec3f *get_acceleration() = 0;
};

#endif // _ACCELERATION_H