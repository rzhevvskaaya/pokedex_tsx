
export interface Pokemon {
    id: number;
    name: string;
    avatar: string;
    status: boolean;
    abilities: {
        ability: {
            name: string;
        }
    }[];
    catchDate?: string;
}
export interface PokemonData {
    name: string;
    url: string;
}

export interface ApiResponse {
    results: PokemonData[];
}
export interface PokemonSummary {
    name: string;
    url: string;
}
export interface Ability {
    name: string;
    slot: number;
}
