import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <header className="header">
        <div className="wrapper">
            <h1 className="title">See where is the ISS in real time</h1>

            <label className="switch">
            <input
                className="checkbox--toggle"
                type="checkbox"
                checked={isDarkMode}
                aria-checked={isDarkMode}
                onChange={handleToggle}
                role="switch"
            />
            <span className="slider round"></span>
            Light mode
            </label>
       </div>
    </header>
  );
};

export default Header;
