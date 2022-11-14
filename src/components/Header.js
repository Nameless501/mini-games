import React, { useState } from 'react';
import '../assets/styles/Header.css';
import SettingsButton from './SettingsButton.js';

function Header({ handleColorsChange, handleColorReverse }) {
    const [menuOpen, toggleMenu] = useState(false);

    function handleMenuToggle() {
        toggleMenu(current => !current);
    }

    return (
        <div className="header">
            <nav className={`header__menu ${menuOpen && 'header__menu_opened'}`} >
                <ul className="header__menu-list" >
                    <li>
                        <button 
                            className="header__menu-button" 
                            onClick={handleColorsChange}
                        >
                            Change colors
                        </button>
                    </li>
                    <li>
                        <button 
                            className="header__menu-button header__menu-button_reverse" 
                            onClick={handleColorReverse}
                        >
                            Reverse colors
                        </button>
                    </li>
                </ul>
            </nav>
            <SettingsButton handleClick={handleMenuToggle} />
        </div>
    );
}

export default Header;