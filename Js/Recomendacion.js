
import { 
    CORS_PROXY, 
    BASE_API_URL 
} from './config.js'; 

const RECOMMEND_BUTTON_ID = 'recommend-button';
const CARD_CONTAINER_ID = 'game-card-container';
const GAMES_CACHE = []; 


const renderGameCard = (game) => {
    const container = document.getElementById(CARD_CONTAINER_ID);
    if (!container) return;

    const platformIcon = game.platform.includes('PC') ? 'windows.png' : 'Browser.png';
    const genreText = game.genre || 'General';

    const cardHTML = `
        <div class="recommended-card">
            <div class="card-image-wrapper">
                <img src="${game.thumbnail}" alt="Portada de ${game.title}">
            </div>
            <h3 class="card-title">${game.title}</h3>
            
            <div class="card-meta">
                <span>
                    <strong>Plataforma:</strong> ${game.platform}
                    <img src="/media/${platformIcon}" alt="${game.platform}" class="platform-icon">
                </span>
                <span>
                    <strong>Género:</strong> ${genreText}
                </span>
                <span>
                    <a href="/html/DetallesGame.html?id=${game.id}" 
                       style="color: var(--color-button); text-decoration: none; font-weight: bold;">
                       Ver Detalles »
                    </a>
                </span>
            </div>
        </div>
    `;

    container.innerHTML = cardHTML;
};

const fetchAllGames = async () => {
    const urlWithProxy = `${CORS_PROXY}${encodeURIComponent(BASE_API_URL)}`;
    
    document.getElementById(CARD_CONTAINER_ID).innerHTML = '<p style="color: #CDE97A;">Cargando catálogo de juegos...</p>';
    
    try {
        const response = await fetch(urlWithProxy);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener el catálogo.`);
        }
        const games = await response.json();
        
        GAMES_CACHE.length = 0; 
        GAMES_CACHE.push(...games);
        
        document.getElementById(CARD_CONTAINER_ID).innerHTML = ''; 

    } catch (error) {
        console.error("Error al obtener el catálogo:", error);
        document.getElementById(CARD_CONTAINER_ID).innerHTML = 
            `<p style="color: red;">Error: No se pudo cargar el catálogo (${error.message}).</p>`;
    }
};

const recommendRandomGame = () => {
    if (GAMES_CACHE.length === 0) {
        document.getElementById(CARD_CONTAINER_ID).innerHTML = 
            '<p style="color: orange;">Catálogo vacío. Intenta recargar la página.</p>';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * GAMES_CACHE.length);
    const recommendedGame = GAMES_CACHE[randomIndex];

    renderGameCard(recommendedGame);
};

const initializeRecommendationPage = () => {
    fetchAllGames();
    const button = document.getElementById(RECOMMEND_BUTTON_ID);
    if (button) {
        button.addEventListener('click', recommendRandomGame);
    }
};

// Ejecutar la inicialización
document.addEventListener('DOMContentLoaded', initializeRecommendationPage);