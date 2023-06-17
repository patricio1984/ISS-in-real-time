import React, { useState, useEffect } from 'react';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';

const Header = () => {

  const [mode, setMode] = useState('dark');

  useEffect(() => {
    if (mode !== 'dark') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [mode]);

  return (
    <header className="header">
        <div className="wrapper">
            <h1 className="title">See where is the ISS in real time</h1>

            <DarkModeToggle
                ariaLabel="Toggle color scheme"
                mode={mode}
                dark="Dark"
                light="Light"
                size="sm"
                inactiveLabelColor="#CCCCCC"
                activeLabelColor="#333333"
                activeTrackColor="#e2e8f0"
                activeTrackColorOnHover="#e2e8f0"
                activeTrackColorOnActive="#cbd5e1"
                inactiveTrackColor="#334155"
                inactiveTrackColorOnHover="#1e293b"
                inactiveTrackColorOnActive="#0f172a"
                inactiveThumbColor="#e2e8f0" 
                activeThumbColor="#1e293b"
                onChange={(mode) => {
                    setMode(mode);
                }}
            />
       </div>
    </header>
  );
};

export default Header;
