import { useEffect, useState } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // Consider mobile and tablet devices (< 1024px which is lg breakpoint in Tailwind)
      // Also check for touch capability as an additional indicator
      const isMobileDevice = window.innerWidth < 1024;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Use mobile UI (Popover) for devices smaller than 1024px OR touch devices
      setIsMobile(isMobileDevice || (isTouchDevice && window.innerWidth < 1280));
    };

    // Check on mount
    checkDevice();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return isMobile;
}
