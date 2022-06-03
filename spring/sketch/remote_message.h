#ifndef _REMOTE_MESSAGE_H
#define _REMOTE_MESSAGE_H

typedef struct __attribute__((packed)) RemoteMessage
{

  unsigned long time; // 4

  float elapsed; // 4

  float voltage;  // 4
  float altitude; // 4

  float gyroscope_x; // 4
  float gyroscope_y; // 4
  float gyroscope_z; // 4

  float acceleration_x; // 4
  float acceleration_y; // 4
  float acceleration_z; // 4

  float magnetometer_x; // 4
  float magnetometer_y; // 4
  float magnetometer_z; // 4

  float rotation_x; // 4
  float rotation_y; // 4
  float rotation_z; // 4

  bool locked; // 1

  bool parachuteVelocity;    // 1
  bool parachuteAltitude;    // 1
  bool parachuteOrientation; // 1

  uint16 flight_observer_state; // 1
};

#endif // _REMOTE_MESSAGE_H
