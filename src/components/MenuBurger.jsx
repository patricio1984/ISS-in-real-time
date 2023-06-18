import React, { useState, useEffect, useRef } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';

const MenuBurger = () => {
    const [mode, setMode] = useState('dark');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const overlayRef = useRef(null);
    const burgerButtonId = 'react-burger-cross-btn';
  
    const handleOverlayClick = (event) => {
      const burgerButton = document.querySelector(`#${burgerButtonId}`);
      if (event.target === overlayRef.current && burgerButton) {
        burgerButton.click();
      }
    };

    useEffect(() => {
      const menuWrap = document.querySelector('.bm-menu-wrap');
      const observer = new MutationObserver(() => {
        const isHidden = menuWrap.getAttribute('aria-hidden') === 'true';
        setIsMenuOpen(!isHidden);
      });
  
      observer.observe(menuWrap, { attributes: true });
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (mode !== 'dark') {
        document.body.classList.add('light-mode');
        } else {
        document.body.classList.remove('light-mode');
        }
    }, [mode]);

    useEffect(() => {
        const burgerButton = document.getElementById('react-burger-cross-btn');

        if (burgerButton) {
            if (isMenuOpen) {
                burgerButton.classList.add('burger-button--hide');
            } else {
                setTimeout(() => {
                    burgerButton.classList.remove('burger-button--hide');
                }, 500);
            }
        }
    }, [isMenuOpen]);
    
    return (
        <div className={`overlay ${isMenuOpen ? 'overlay-open' : ''}`} ref={overlayRef} onClick={handleOverlayClick}>
            <div className="container">
                <Menu right noOverlay>      
                    <ul>
                        <li>
                            <DarkModeToggle
                                ariaLabel="Toggle color scheme"
                                mode={mode}
                                dark="Dark"
                                light="Light"
                                size="md"
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
                        </li>

                        <li className="menulist">
                            <a className="menuitem" href="https://www.linkedin.com/in/patriciomainero/" target="_blank">About me</a>
                        </li>

                        <li className="menulist">
                            <a className="menuitem" href="https://patricio1984.github.io/port/" target="_blank">My portfolio page</a>
                        </li>

                        <li className="menulist">
                            <a className="menuitem" href="https://github.com/patricio1984" target="_blank">My Github repositories</a>
                        </li>
                    </ul>
                </Menu>   
            </div>
        </div>
    )
}

export default MenuBurger