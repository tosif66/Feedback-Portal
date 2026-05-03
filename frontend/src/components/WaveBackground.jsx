import React from "react";

const WaveBackground = () => {
  return (
    <svg
      className="absolute top-0 left-0 w-full h-[300px] z-[-1]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="10%" stopColor="#6A1B9A" />
          <stop offset="100%" stopColor="#E91E63" />
        </linearGradient>
      </defs>
      <path
        fill="url(#gradient)"
        d="M0,160L48,186.7C96,213,192,267,288,266.7C384,267,480,213,576,176C672,139,768,117,864,133.3C960,149,1056,203,1152,218.7C1248,235,1344,213,1392,202.7L1440,192V0H0Z"
      />
    </svg>
  );
};

export default WaveBackground;
