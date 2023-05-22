#include "kalman.h"

Kalman::Kalman()
{
    this->_kalman_gain = 0.0;
    this->_last_estimate = 0.0;

    this->_current_estimate = 0.0;
    this->_process_variance = 0.01;

    this->_error_estimation = 1.0;
    this->_error_measurement = 1.0;
}

void Kalman::set_tunings(float measurement_uncertainty, float process_variance)
{
    this->_process_variance = process_variance;
    this->_error_estimation = measurement_uncertainty;
    this->_error_measurement = measurement_uncertainty;
}

float Kalman::update_estimate(float x)
{
    this->_kalman_gain = this->_error_estimation / (this->_error_estimation + this->_error_measurement);
    this->_current_estimate = this->_last_estimate + this->_kalman_gain * (x - this->_last_estimate);
    this->_error_estimation = (1.0 - this->_kalman_gain) * this->_error_estimation + fabs(this->_last_estimate - this->_current_estimate) * this->_process_variance;
    this->_last_estimate = this->_current_estimate;

    return this->_current_estimate;
}