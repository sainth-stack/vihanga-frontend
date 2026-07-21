import { useState, useEffect } from 'react';
const getIsMobile = () => window.innerWidth <= 820;

export default function useWindowSize() {
  const [isMobile, setIsMobile] = useState(getIsMobile());
  useEffect(() => {
    const onResize = () => {
      setIsMobile(getIsMobile());
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [isMobile]);

  return isMobile;
}