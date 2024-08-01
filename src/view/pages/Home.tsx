import React, { useEffect, useState, useRef, useCallback } from 'react';
import Service from '@/service/service';
import { Pokemon } from '@/model/model';
import PokemonCard from '@/view/components/PokemonCard';
import Loader from '@/view/components/Loader';

const Home: React.FC = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const observer = useRef<IntersectionObserver | null>(null);

    const fetchPokemons = useCallback(async (page: number) => {
        const newPokemons = await Service.fetchPokemonData(page);
        setPokemons((prevPokemons) => [...prevPokemons, ...newPokemons]);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPokemons(page);
    }, [page, fetchPokemons]);

    const lastPokemonElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prevPage: number) => {
                        const newPage = prevPage + 1;
                        setLoading(true);
                        return newPage;
                    });
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading]
    );

    const handleStatusChange = (updatedPokemon: Pokemon) => {
        setPokemons((prevPokemons: Pokemon[]) =>
            prevPokemons.map((pokemon: Pokemon) =>
                pokemon.id === updatedPokemon.id ? {
                    ...pokemon,
                    status: updatedPokemon.status,
                    catchDate: updatedPokemon.catchDate
                } : pokemon
            )
        );
    };

    return (
        <div>
            <div className="cards">
                {pokemons.map((pokemon, index) => {
                    if (pokemons.length === index + 1) {
                        return (
                            <PokemonCard
                                ref={lastPokemonElementRef}
                                key={pokemon.id}
                                data={pokemon}
                                onStatusChange={handleStatusChange}
                            />
                        );
                    } else {
                        return (
                            <PokemonCard
                                key={pokemon.id}
                                data={pokemon}
                                onStatusChange={handleStatusChange}
                            />
                        );
                    }
                })}
            </div>
            {loading && (
                <div className="loader-container">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default Home;
