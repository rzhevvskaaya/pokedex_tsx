import React, { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pokemon } from '@/model/model';
import Service from '@/service/service';

interface PokemonCardProps {
    data: Pokemon;
    onStatusChange: (pokemon: Pokemon) => void;
}

const PokemonCard = forwardRef<HTMLDivElement, PokemonCardProps>(({ data, onStatusChange }, ref) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        const from = data.status ? 'caught' : 'home';
        navigate(`/pokemon/${data.id}`, { state: { from } });
    };

    const handleButtonClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!data.status) {
            Service.toggleCatchStatus(data);
            onStatusChange(data);
        }
    };

    return (
        <div className="card" ref={ref} onClick={handleCardClick}>
            <h2>{data.name}</h2>
            <p>ID: {Service.generateId(data.id)}</p>
            <img src={data.avatar} alt={data.name} />
            <div className="card-buttons">
                <button onClick={handleButtonClick} disabled={data.status}>
                    {data.status ? 'Пойман' : 'Поймать'}
                </button>
            </div>
        </div>
    );
});

export default PokemonCard;