import { useState, useEffect } from "react";

export interface Dimension {
  width: number;
  height: number;
  isMobile?: boolean;
  isTab?: boolean;
}

const getDimensions = (): Dimension => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

const useWindowDimensions = (): Dimension => {
  const [windowDimensions, setWindowDimensions] = useState(getDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getDimensions());
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    ...windowDimensions,
    isMobile: windowDimensions.width <= 480,
    isTab: windowDimensions.width > 481 && windowDimensions.width <= 767,
  };
};

export default useWindowDimensions;
