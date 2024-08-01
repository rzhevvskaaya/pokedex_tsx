import React from 'react';

const NoPokemonPage: React.FC = () => {
    return (
        <div className="no-pokemon-container">
            <div className="no-pokemon-content">
                <h2>Ни один покемон пока не пойман</h2>
            </div>
        </div>
    );
};

export default NoPokemonPage;