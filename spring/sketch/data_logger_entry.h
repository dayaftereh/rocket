#ifndef _DATA_LOGGER_ENTRY_H
#define _DATA_LOGGER_ENTRY_H

// The struct for the data logger entry
typedef struct {

  uint16_t time;

  float voltage;
  float altitude;

  float gyroscopeX;
  float gyroscopeY;
  float gyroscopeZ;

  float accelerationX;
  float accelerationY;
  float accelerationZ;

  float rotationX;
  float rotationY;
  float rotationZ;

  bool parachuteAltitude;
  bool parachuteOrientation;
  
} DataLoggerEntry;

#endif // _DATA_LOGGER_ENTRY_H
