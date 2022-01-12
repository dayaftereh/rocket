#ifndef _DATA_LOGGER_ENTRY_H
#define _DATA_LOGGER_ENTRY_H

struct __attribute__((packed)) DataLoggerEntry
{

  uint32_t time; // 4
  
  uint16_t state; // 2

  float elapsed; // 4

  float voltage;  // 4
  float altitude; // 4
  float maximum_altitude; // 4

  float velocity_x; // 4
  float velocity_y; // 4
  float velocity_z; // 4

  float acceleration_x; // 4
  float acceleration_y; // 4
  float acceleration_z; // 4

  float rotation_x; // 4
  float rotation_y; // 4
  float rotation_z; // 4

  bool parachuteVelocity;    // 1
  bool parachuteAltitude;    // 1
  bool parachuteOrientation; // 1
};

#endif // _DATA_LOGGER_ENTRY_H
