import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/public/img/logo.png';

const Header: React.FC = () => {
    return (
        <header>
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <nav>
                <Link to="/">Главная</Link>
                <Link to="/caught">Пойманные покемоны</Link>
            </nav>
        </header>
    );
};

export default Header;