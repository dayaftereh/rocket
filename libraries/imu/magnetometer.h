#ifndef _MAGNETOMETER_H
#define _MAGNETOMETER_H

#include "vec3f.h"

class Magnetometer
{
public:   
    virtual bool update() = 0;
    virtual Vec3f *get_magnetometer() = 0;
};

#endif // _MAGNETOMETER_H