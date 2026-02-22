import React from 'react';
import './Hero.css';
import AnimatedNumber from '../common/AnimatedNumber';
import FadeInUp from '../common/FadeInUp';
import MagneticButton from '../common/MagneticButton';

const Hero = ({ latitude, longitude }) => {
  const handleScroll = () => {
    const mapEl = document.getElementById('map');
    if (mapEl && typeof mapEl.scrollIntoView === 'function') {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <FadeInUp delay={200}>
          <h1 className="hero-title">ISS TRACKER</h1>
        </FadeInUp>
        <FadeInUp delay={400}>
          <h2 className="hero-subtitle">ORBITING HUMANITY'S OUTPOST</h2>
        </FadeInUp>
        <FadeInUp delay={600}>
          <div className="hero-coordinates">
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span>LIVE</span>
            </div>
            <div className="coord-divider"></div>
            <div className="coord-box">
              <span className="coord-label">LAT</span>
              <span className="coord-value">
                <AnimatedNumber value={latitude} format={(v) => v.toFixed(4)} />°
              </span>
            </div>
            <div className="coord-divider"></div>
            <div className="coord-box">
              <span className="coord-label">LNG</span>
              <span className="coord-value">
                <AnimatedNumber value={longitude} format={(v) => v.toFixed(4)} />°
              </span>
            </div>
          </div>
        </FadeInUp>
      </div>
      <FadeInUp delay={800} className="scroll-indicator-wrapper">
        <MagneticButton onClick={handleScroll} className="scroll-indicator" type="button">
          <span>EXPLORE</span>
          <div className="scroll-line"></div>
        </MagneticButton>
      </FadeInUp>
    </section>
  );
};

export default Hero;
