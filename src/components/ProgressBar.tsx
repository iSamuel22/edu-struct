import React, { useEffect, useRef } from 'react';

interface ProgressBarProps {
  progress: number;
  isValid: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, isValid }) => {
  const progressRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        ref={progressRef}
        className={`h-full transition-all duration-700 ease-out ${
          isValid 
            ? progress === 100 
              ? 'bg-emerald-500' 
              : 'bg-blue-500'
            : 'bg-amber-500'
        }`}
        style={{ width: '0%' }}
      />
    </div>
  );
};

export default ProgressBar;