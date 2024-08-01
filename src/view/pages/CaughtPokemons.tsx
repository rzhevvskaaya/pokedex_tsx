import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Service from '@/service/service';
import { Pokemon } from '@/model/model';
import PokemonCard from '@/view/components/PokemonCard';
import Loader from '@/view/components/Loader';

const CaughtPokemons: React.FC = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCaughtPokemons = async () => {
            setLoading(true);
            const data = await Service.fetchCaughtPokemons();
            setPokemons(data);
            setLoading(false);
        };

        fetchCaughtPokemons();
    }, []);

    useEffect(() => {
        if (!loading && pokemons.length === 0) {
            navigate('/no-pokemon');
        }
    }, [loading, pokemons, navigate]);

    const handleStatusChange = (updatedPokemon: Pokemon) => {
        setPokemons((prevPokemons) =>
            prevPokemons.map((pokemon) =>
                pokemon.id === updatedPokemon.id ? { ...pokemon, status: updatedPokemon.status, catchDate: updatedPokemon.catchDate } : pokemon
            )
        );
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <div className="cards">
                {pokemons.map((pokemon) => (
                    <PokemonCard
                        key={pokemon.id}
                        data={pokemon}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default CaughtPokemons;