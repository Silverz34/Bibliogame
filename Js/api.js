
const CORS_PROXY = 'https://corsproxy.io/?'; 
const BASE_API_URL = 'https://www.freetogame.com/api/games';
const DETAIL_API_URL_BASE = 'https://www.freetogame.com/api/game?id='; 
const GAME_LIST_CONTAINER_ID = 'game-result'; 
const SELECT_GENRE_ID = 'genero-select';

const GAME_GENRES = [
 "mmorpg", "shooter", "strategy", "moba", "racing", "sports", "social", 
 "sandbox", "open-world", "survival", "pvp","pixel","zombie"
];

const createGameCardHTML = (game) => {
const platformIcon = game.platform.includes('PC') ? 'windows.png' : 'web.png';
const genreText = game.genre || 'Desconocido';
 return `
  <a href="/html/DetallesGame.html?id=${game.id}" class="game-link-wrapper">
  <article class="game-card" data-game-id="${game.id}">
        <div class="game-cover">
            <img src="${game.thumbnail}" alt="Portada de ${game.title}">
        </div>
        <h3 class="title">${game.title}</h3>
        <p class="description">${game.short_description}</p>
        <div class="game-footer">
          <span class="genre">${genreText}</span>
            <div class="icons-platform">
            <img src="/media/${platformIcon}" alt="Icono de Plataforma">
            </div>
        </div>
   </article>
</a>`;};

const updateResultsContainer = (content, isError = false) => {
 const container = document.getElementById(GAME_LIST_CONTAINER_ID); 
    if (!container) return console.error(`Contenedor con ID ${GAME_LIST_CONTAINER_ID} no encontrado.`);
    if (isError || !content.includes('<article')) {
        container.innerHTML = `<p style="padding: 20px; color: ${isError ? 'red' : 'inherit'};">${content}</p>`;
    } else {container.innerHTML = content;}
};

const populateGenreDropdown = () => {
    const selectElement = document.getElementById(SELECT_GENRE_ID);
    if (!selectElement) return;

    selectElement.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Game List";
    selectElement.appendChild(defaultOption);
    
    GAME_GENRES.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre; 
        option.textContent = genre.toUpperCase();
        selectElement.appendChild(option);
    });
};

// --- 3. Lógica de Llamada a la API (Index - CON CORS FIX) ---

const fetchAndRenderGames = async (genre = '') => {
    const isFiltered = genre && genre !== '';
    
    // 1. Construir la URL de destino de la API de FreeToGame
    const targetUrl = isFiltered ? `${BASE_API_URL}?category=${genre}` : BASE_API_URL;
    const urlWithProxy = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
    
    updateResultsContainer('Cargando juegos...');

    try {
        // Usamos la URL con el proxy
        const response = await fetch(urlWithProxy); 
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo acceder a los datos de la API.`);
        }
        const gamesData = await response.json();
        
        if (gamesData.length === 0) {
            updateResultsContainer(`No se encontraron juegos para el género "${genre.toUpperCase()}".`);
            return;
        }
        
        const gamesHTML = gamesData.map(createGameCardHTML).join('');
        updateResultsContainer(gamesHTML);

    } catch (error) {
        console.error("Error al obtener juegos:", error);
        updateResultsContainer(`Error al cargar los juegos. Inténtalo de nuevo. (${error.message})`, true);
    }
};

// --- 4. Inicialización (Index) ---

const initializeIndexPage = () => {
    populateGenreDropdown();
    fetchAndRenderGames(); 
    const selectElement = document.getElementById(SELECT_GENRE_ID);
    if (selectElement) {
        selectElement.addEventListener('change', (event) => {
            const selectedGenre = event.target.value;
            fetchAndRenderGames(selectedGenre);
        });
    }
};

const getGameIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

const fetchAndRenderGameDetails = async (id) => {
    const targetUrl = `${DETAIL_API_URL_BASE}${id}`;
    const urlWithProxy = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;

    const mainDetails = document.querySelector('.details-game');
    if (!mainDetails) return;
    mainDetails.querySelector('.description-game').innerHTML = '<p>Cargando detalles del juego...</p>'; 

    try {
        const response = await fetch(urlWithProxy);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se encontraron detalles para el ID ${id}.`);
        }

        const game = await response.json();
        document.querySelector('.game-title').textContent = game.title;
        document.querySelector('.game-developer').textContent = `Creado por: ${game.developer}`;
        document.querySelector('.release-date').innerHTML = 
            `<img src="/media/calendar.png" alt="Calendario" style="width:20px; vertical-align:middle;"> ${game.release_date}`;
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.onclick = () => window.open(game.game_url, '_blank');
        }
        document.querySelector('.description-game p').textContent = game.description;
        document.querySelector('.game-cover img').src = game.thumbnail;
        document.querySelector('.game-cover img').alt = game.title;
        const screenshotsGrid = document.querySelector('.screenshots-grid');
        screenshotsGrid.innerHTML = ''; 
        
        if (game.screenshots && game.screenshots.length > 0) {
            game.screenshots.forEach(screenshot => {
                screenshotsGrid.innerHTML += `<img src="${screenshot.image}" alt="Captura de ${game.title}">`;
            });
        }
        
    } catch (error) {
        console.error("Error al obtener detalles:", error);
        mainDetails.querySelector('.description-game').innerHTML = 
            `<p style="color: red;">Error al cargar los detalles del juego: ${error.message}</p>`;
    }
};

const initializeDetailPage = () => {
    const gameId = getGameIdFromUrl();
    
    if (gameId) {
        fetchAndRenderGameDetails(gameId);
    } else {
        document.querySelector('.details-game').innerHTML = 
            '<p class="description-game" style="color: red;">Error: No se especificó el ID del juego en la URL.</p>';
    }
};

if (document.title.includes("Lista de Juegos")) {
    document.addEventListener('DOMContentLoaded', initializeIndexPage);
} else if (document.title.includes("Detalles-Card")) {
    document.addEventListener('DOMContentLoaded', initializeDetailPage);
}