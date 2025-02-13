import React from 'react';

const ProgressBar = ({progress}) => {
  return (
    <div
      style={{
        width: '70%',
        backgroundColor: '#F2F3F6',
        borderRadius: '10px',

        zIndex: 1000,
      }}>
      <div
        style={{
          width: `${progress}%`,
          height: '15px',
          backgroundColor: '#4CAF50',
          borderRadius: '5px',
          transition: 'width 0.3s ease',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: '-1px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#fff',
          fontWeight: 'bold',
        }}>
        {progress}%
      </span>
    </div>
  );
};

export default ProgressBar;
