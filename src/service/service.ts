import Transport from "@/transport/transport";
import Store from "@/store/store";
import { Pokemon } from "@/model/model";
import { makeAutoObservable } from 'mobx';
export class Service {
    constructor() {
        makeAutoObservable(this);
    }
    async fetchPokemonData(page: number = 1): Promise<Pokemon[]> {
        try {
            const offset = (page - 1) * 20;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
            const data = await response.json();
            const pokemons: Pokemon[] = await Promise.all(
                data.results.map(async (pokemon: { url: string }) => {
                    const pokemonData = await fetch(pokemon.url).then(res => res.json());
                    const status = this.getPokemonStatus(pokemonData.id);
                    const catchDate = this.getPokemonCatchDate(pokemonData.id);
                    return {
                        name: pokemonData.name,
                        id: pokemonData.id,
                        avatar: pokemonData.sprites.front_default,
                        status: status,
                        catchDate: catchDate,
                        abilities: pokemonData.abilities.map((ability: any) => ({
                            ability: {
                                name: ability.ability.name
                            }
                        }))
                    };
                })
            );
            return pokemons;
        } catch (error) {
            console.error("Error fetching Pokemon data:", error);
            return [];
        }
    }

    async fetchPokemonById(id: number): Promise<Pokemon | null> {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json());
            const status = this.getPokemonStatus(response.id);
            const catchDate = this.getPokemonCatchDate(response.id);
            const pokemon: Pokemon = {
                name: response.name,
                id: response.id,
                avatar: response.sprites.front_default,
                status: status,
                catchDate: catchDate,
                abilities: response.abilities.map((ability: any) => ({
                    ability: {
                        name: ability.ability.name
                    }
                }))
            };
            return pokemon;
        } catch (error) {
            console.error("Error fetching Pokemon data:", error);
            return null;
        }
    }

    async fetchCaughtPokemons(): Promise<Pokemon[]> {
        const statusData = JSON.parse(localStorage.getItem('pokemonStatus') || '{}');
        const caughtPokemonIds = Object.keys(statusData).filter(id => statusData[id].status);
        const caughtPokemons: Pokemon[] = await Promise.all(
            caughtPokemonIds.map(async (id: string) => {
                const pokemon = await this.fetchPokemonById(parseInt(id, 10));
                return pokemon;
            })
        );
        return caughtPokemons.filter(pokemon => pokemon !== null) as Pokemon[];
    }

    generateId(number: number): string {
        return number.toString().padStart(4, '0');
    }

    toggleCatchStatus = (pokemon: Pokemon): void => {
        pokemon.status = !pokemon.status;
        const catchDate = pokemon.status ? new Date().toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }) : null;
        pokemon.catchDate = catchDate;
        this.savePokemonStatus(pokemon.id, pokemon.status, catchDate);
        const index = Store.pokemonsInStore.findIndex((p: Pokemon) => p.id === pokemon.id);

        if (pokemon.status && index === -1) {
            Store.pokemonsInStore.push(pokemon);
        } else if (!pokemon.status && index !== -1) {
            Store.pokemonsInStore.splice(index, 1);
        }
    };

    private savePokemonStatus(id: number, status: boolean, catchDate: string | null): void {
        const statusData = JSON.parse(localStorage.getItem('pokemonStatus') || '{}');
        statusData[id] = {
            status: status,
            catchDate: catchDate
        };
        localStorage.setItem('pokemonStatus', JSON.stringify(statusData));
    }

    private getPokemonStatus(id: number): boolean {
        const statusData = JSON.parse(localStorage.getItem('pokemonStatus') || '{}');
        return statusData[id]?.status || false;
    }

    private getPokemonCatchDate(id: number): string | null {
        const statusData = JSON.parse(localStorage.getItem('pokemonStatus') || '{}');
        return statusData[id]?.catchDate || null;
    }


}

export default new Service();