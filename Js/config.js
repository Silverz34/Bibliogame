
export const CORS_PROXY = 'https://corsproxy.io/?'; 
export const BASE_API_URL = 'https://www.freetogame.com/api/games';
export const DETAIL_API_URL_BASE = 'https://www.freetogame.com/api/game?id='; 

export const GAME_LIST_CONTAINER_ID = 'game-result'; 
export const SELECT_GENRE_ID = 'genero-select';

export const GAME_GENRES = [
    "mmorpg", "shooter", "strategy", "moba", "racing", "sports", "social", 
    "sandbox", "open-world", "survival", "pvp", "pixel", "voxel",
    "zombie"
];

export const getGameIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};