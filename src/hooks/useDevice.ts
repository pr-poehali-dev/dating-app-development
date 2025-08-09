import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const useDevice = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isTouchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsTouchDevice(isTouchSupported);
      
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return {
    deviceType,
    isTouchDevice,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isTouch: deviceType === 'mobile' || deviceType === 'tablet' || isTouchDevice
  };
};