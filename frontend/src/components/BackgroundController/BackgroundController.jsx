import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BackgroundController.css';

gsap.registerPlugin(ScrollTrigger);

const BackgroundController = () => {
    const bgLayer2Ref = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        const layer2 = bgLayer2Ref.current;

        // Scrub opacity of Layer 2 (Product Gradient) based on scroll
        gsap.to(layer2, {
            opacity: 1,
            ease: "none", // Linear scrub
            scrollTrigger: {
                trigger: ".food-display", // Target the product section
                start: "top bottom", // Start fading in when top of products hits bottom of viewport
                end: "top center",   // Fully visible when top of products hits center
                scrub: 0.5,          // Smooth scrubbing
                id: "bg-transition"
            }
        });

        return () => {
            ScrollTrigger.getById("bg-transition")?.kill();
        };
    }, []);

    return (
        <div className="background-controller">
            <div className="bg-layer bg-layer-1"></div>
            <div ref={bgLayer2Ref} className="bg-layer bg-layer-2"></div>
        </div>
    );
};

export default BackgroundController;
