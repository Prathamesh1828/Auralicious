import React, { useEffect, useState } from 'react';
import './ScrollToTop.css';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleButtonVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleButtonVisibility);
    return () => window.removeEventListener('scroll', toggleButtonVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    isVisible && (
      <button className="scroll-to-top-btn" onClick={scrollToTop}>
        <ArrowUpwardIcon fontSize="medium" />
      </button>
    )
  );
};

export default ScrollToTopButton;
