
import { 
    CORS_PROXY, 
    BASE_API_URL, 
    GAME_LIST_CONTAINER_ID, 
    SELECT_GENRE_ID, 
    GAME_GENRES 
} from './config.js';


const createGameCardHTML = (game) => {
  const platformIcon = game.platform.includes('PC') ? 'windows.png' : 'Browser.png';
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
   if (!container) return console.error(`Contenedor con ID ${GAME_LIST_CONTAINER_ID} no encontrado en index.html.`);
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

const fetchAndRenderGames = async (genre = '') => {
  const isFiltered = genre && genre !== '';

  const targetUrl = isFiltered ? `${BASE_API_URL}?category=${genre}` : BASE_API_URL;
  const urlWithProxy = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
  updateResultsContainer('Cargando juegos...');
  try {
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

document.addEventListener('DOMContentLoaded', initializeIndexPage);