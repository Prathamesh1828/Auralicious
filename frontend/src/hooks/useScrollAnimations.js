import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useScrollAnimations = () => {
    useEffect(() => {
        // 1. Accessibility Check
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        // Configuration
        const CONFIG = {
            colors: {
                highlight: getComputedStyle(document.documentElement).getPropertyValue('--bg-highlight').trim(),
                footer: getComputedStyle(document.documentElement).getPropertyValue('--bg-footer').trim()
            },
            scrubIntensity: 0.6,
            mobileBreakpoint: 768
        };

        // 2. Background Color Transitions
        // Transition 1: Default -> Highlight (Enter Products)
        gsap.to("body", {
            backgroundColor: CONFIG.colors.highlight,
            scrollTrigger: {
                trigger: ".food-display", // Using existing class from FoodDisplay.jsx
                start: "top 75%",
                end: "top 25%",
                scrub: CONFIG.scrubIntensity,
                id: "bg-highlight"
            }
        });

        // Transition 2: Highlight -> Footer Color (Enter Footer)
        gsap.to("body", {
            backgroundColor: CONFIG.colors.footer,
            scrollTrigger: {
                trigger: ".footer", // Using existing class from Footer.jsx
                start: "top bottom",
                end: "top top",
                scrub: CONFIG.scrubIntensity,
                id: "bg-footer"
            }
        });

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);
};

export default useScrollAnimations;
