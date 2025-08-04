import React from 'react';
import { FiLoader } from 'react-icons/fi';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <FiLoader className="spin" />
      <p>Loading customers...</p>
    </div>
  );
};

export default LoadingSpinner;