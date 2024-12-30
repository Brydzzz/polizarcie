"use client";

import { useEffect, useState } from "react";

export enum ViewportSize {
  XS = 600,
  SM = 768,
  MD = 992,
  LG = 1200,
  XL = 1920,
}

const useViewportSize = () => {
  const [size, setSize] = useState<ViewportSize>(ViewportSize.XL);

  const handleResize = () => {
    setSize(document.body.clientWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  return size;
};

export default useViewportSize;
