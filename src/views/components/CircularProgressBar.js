import React from 'react';

const CircularProgressBar = ({percentage}) => {
  const radius = 16; // Adjusted radius for size
  const strokeWidth = 3; // Adjusted stroke width
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  // Ensure percentage is a number (in case it's passed as a string)
  const numericPercentage = Number(percentage);

  return (
    <>
      <svg
        className="progress-ring"
        width={2 * (radius + strokeWidth)}
        height={2 * (radius + strokeWidth)}>
        <circle
          className="progress-ring__background"
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
        />
        <circle
          className="progress-ring__progress"
          stroke="#4caf50"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
        {/* Add text element to show percentage in the center */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="progress-ring__text"
          fontSize="10"
          fill="#000">
          {`${numericPercentage}%`}
        </text>
      </svg>
      <div className="fw-semibold text-dark mb-1">
        {numericPercentage === 100 ? (
          <div className="text-center">
            <div
              style={{
                marginTop: '14px',
                color: '#4caf50',
                fontSize: '15px',
                fontStyle: 'italic',
                animation: 'fadeIn 1s ease-out',
              }}>
              Congratulations! 🎉 Profile completed!
            </div>
            {/* <span
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#4caf50',
                background: 'linear-gradient(90deg, #4caf50, #81c784)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
                letterSpacing: '1px',
              }}>
              your profile is completed!
            </span> */}
          </div>
        ) : (
          <span>Please complete your profile</span>
        )}
      </div>
    </>
  );
};

export default CircularProgressBar;
