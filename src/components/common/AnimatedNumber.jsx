import React, { useEffect, useState, useRef } from 'react';

const AnimatedNumber = ({ value, duration = 1000, format = (v) => v }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = prevValueRef.current;
    const endValue = parseFloat(value) || 0;
    
    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo for smoother deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentVal = startValue + (endValue - startValue) * easeProgress;
      setDisplayValue(currentVal);
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  return <span>{format(displayValue)}</span>;
};

export default AnimatedNumber;
