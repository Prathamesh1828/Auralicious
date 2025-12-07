import React, { useEffect } from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'
import AOS from "aos";
import "aos/dist/aos.css";

const AppDownload = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 })
  }, [])
  return (
    <div className='app-download' id='app-download'>
      <p>For Better Experience Download <br /> Auralicious App </p>
      <div data-aos="flip-right" className="app-download-platforms">
        <img src={assets.play_store} alt="" />
        <img src={assets.app_store} alt="" />
      </div>
    </div>
  )
}

export default AppDownload
