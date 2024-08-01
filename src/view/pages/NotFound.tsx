import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1>404</h1>
                <p>Страница не найдена</p>
                <button onClick={handleBackClick}>Вернуться на главную</button>
            </div>
        </div>
    );
};

export default NotFound;