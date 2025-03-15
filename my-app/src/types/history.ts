export type PokemonDetection = {
    isPokemon: boolean;
    description: string;
    name: string;
    pokedex_code?: string;
    weakness?: string[];
    type?: string[];
    properties?: {
        height: string;
        category: string;
        weight: string;
        abilities: string;
        Gender: string;
    };
};
export type HistoryElem = {
    id: number,
    created_at: string,
    user_id: number,
    url: string,
    body: PokemonDetection
};