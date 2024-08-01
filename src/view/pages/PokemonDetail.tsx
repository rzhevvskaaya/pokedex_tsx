import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Service from '@/service/service';
import { Pokemon } from '@/model/model';
import Loader from '@/view/components/Loader';

const PokemonDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchPokemon = async () => {
            setLoading(true);
            const data = await Service.fetchPokemonById(parseInt(id, 10));
            setPokemon(data);
            setLoading(false);
        };

        fetchPokemon();
    }, [id]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleCatch = () => {
        if (pokemon && !pokemon.status) {
            Service.toggleCatchStatus(pokemon);
            setPokemon({ ...pokemon, status: true, catchDate: new Date().toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }) });
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!pokemon) {
        return <div>Pokemon not found</div>;
    }

    return (
        <div className="pokemon-detail">
            <button onClick={handleBackClick}>Назад</button>
            <h1>{pokemon.name}</h1>
            <p>ID: {Service.generateId(pokemon.id)}</p>
            <img src={pokemon.avatar} alt={pokemon.name} />
            <div>
                <h3>Abilities</h3>
                <ul>
                    {pokemon.abilities.map((ability, index) => (
                        <li key={index}>{ability.ability.name}</li>
                    ))}
                </ul>
            </div>
            <p>Статус: {pokemon.status ? 'Пойман' : 'Не пойман'}</p>
            <p>Дата: {pokemon.catchDate}</p>
            <button onClick={handleCatch} disabled={pokemon.status}>{pokemon.status ? 'Пойман' : 'Поймать'}</button>
        </div>
    );
};

export default PokemonDetail;