// components/LoadingWrapper.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Loader from './Loader';

interface LoadingWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  delay?: number;
}

const LoadingWrapper = ({ 
  children, 
  isLoading = false,
  delay = 300 
}: LoadingWrapperProps) => {
  const [showLoader, setShowLoader] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Show loader for at least `delay` ms to prevent flashing
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  // If still loading or not mounted yet, show loader
  if (isLoading || !isMounted || showLoader) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default LoadingWrapper;