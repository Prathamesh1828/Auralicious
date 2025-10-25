import React, { useEffect } from "react";
import "./Header.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Header = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  return (
    <div
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="1000"
      className="header"
    >
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>
          Indulge in a world of flavors with our diverse menu, showcasing
          mouthwatering dishes made from the finest ingredients and crafted with
          exceptional culinary skill. Whether you're in the mood for a
          comforting classic or an adventurous new taste, our mission is to
          satisfy your cravings and turn every meal into a memorable dining
          experience.
        </p>
        <a href="#explore-menu">
          <button>View Menu</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
