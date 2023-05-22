#ifndef _KALMAN_H
#define _KALMAN_H

#include <math.h>
#include <Arduino.h>

class Kalman
{
public:
    Kalman();

    /**
     * updates the kalman parameters for filtering and estimating
     * measurement_uncertainty - How much do we expect to our measurement vary
     * process_variance - usually a small number between 0.001 and 1 - how fast your measurement moves. Recommended 0.01. Should be tunned to your needs.
     */
    void set_tunings(float measurement_uncertainty, float process_variance);

    float update_estimate(float x);

private:
    float _kalman_gain;
    float _last_estimate;
    float _current_estimate;
    float _process_variance;
    float _error_estimation;
    float _error_measurement;
};

#endif // _KALMAN_H
