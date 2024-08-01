import { makeAutoObservable } from 'mobx';
import { Pokemon } from '@/model/model';

class Store {
    pokemonsInStore: Pokemon[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setPokemons(pokemons: Pokemon[]) {
        this.pokemonsInStore = pokemons;
    }

    addPokemon(pokemon: Pokemon) {
        this.pokemonsInStore.push(pokemon);
    }

}

const store = new Store();

export default store;