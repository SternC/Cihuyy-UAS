import React, { useEffect } from 'react';

const PreventArrowScroll = ({ 
  children, 
  preventArrowKeys = true, 
  preventAllKeyboardScroll = false 
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const scrollKeys = preventAllKeyboardScroll
        ? ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']
        : ['ArrowUp', 'ArrowDown'];

      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);


    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [preventArrowKeys, preventAllKeyboardScroll]);

  return <>{children}</>;
};

export default PreventArrowScroll;