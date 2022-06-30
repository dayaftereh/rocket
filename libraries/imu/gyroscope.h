#ifndef _GYROSCOPE_H
#define _GYROSCOPE_H

#include "vec3f.h"

class Gyroscope
{
public:
    virtual bool update() = 0;
    virtual Vec3f *get_gyroscope() = 0;
};

#endif // _GYROSCOPE_H