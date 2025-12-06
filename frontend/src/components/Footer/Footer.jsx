import React, { useEffect } from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import AOS from "aos";
import "aos/dist/aos.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 })
  }, [])
  return (
    <div className='footer' id='footer'>
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <div className='footer-content'>
        <div className="footer-content-left">
          <h1 className="footer-logo-text">AURALICIOUS</h1>
          <p>Experience the finest flavors with Auralicious. We deliver fresh, delicious meals right to your doorstep. Quality ingredients, exceptional taste, and outstanding service - that's our promise.</p>
          <div data-aos="fade-up"
            data-aos-anchor-placement="bottom-bottom" className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://www.instagram.com/__prattham/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.linkedin.com/in/prathamesh-jaiswar-b11747345/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91 9000 600 000</li>
            <li>contact@auralicious.com</li>
          </ul>
        </div>

      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © Auralicious - All Rights Reserved.</p>
    </div>
  )
}

export default Footer
