#ifndef _DATA_LOGGER_ENTRY_H
#define _DATA_LOGGER_ENTRY_H

// The struct for the data logger entry
// 52
typedef struct __attribute__((packed)) DataLoggerEntry {

  uint16_t time; // 2

  float elapsed; // 4

  float voltage; // 4
  float altitude; // 4

  float gyroscopeX; // 4
  float gyroscopeY; // 4
  float gyroscopeZ; // 4

  float accelerationX; // 4
  float accelerationY; // 4
  float accelerationZ; // 4

  float rotationX; // 4
  float rotationY; // 4
  float rotationZ; // 4

  bool parachuteAltitude; // 1
  bool parachuteOrientation; // 1

} ;

#endif // _DATA_LOGGER_ENTRY_H
