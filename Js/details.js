// /Js/details.js

import { 
    CORS_PROXY, 
    DETAIL_API_URL_BASE, 
    getGameIdFromUrl 
} from './config.js';

/**
 * Obtiene los detalles de un juego por ID y actualiza la UI.
 * @param {string} id - El ID del juego.
 */
const fetchAndRenderGameDetails = async (id) => {
    // 1. Construir la URL de destino de la API de FreeToGame
    const targetUrl = `${DETAIL_API_URL_BASE}${id}`;

    // 2. Aplicar el proxy a la URL de destino
    const urlWithProxy = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;

    const mainDetails = document.querySelector('.details-game'); 
    
    if (!mainDetails) return;
    
    // Muestra un mensaje de carga. Asume que description-game existe.
    const descriptionArea = document.querySelector('.description-game') || mainDetails;
    descriptionArea.innerHTML = '<p>Cargando detalles del juego...</p>'; 

    try {
        const response = await fetch(urlWithProxy);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se encontraron detalles para el ID ${id}.`);
        }

        const game = await response.json();
        
        // --- Actualizar el DOM con los datos del juego ---
        document.querySelector('.game-title').textContent = game.title;
        document.querySelector('.game-developer').textContent = `Creado por: ${game.developer}`;
        
        const releaseDateSpan = document.querySelector('.release-date');
        if (releaseDateSpan) {
            releaseDateSpan.innerHTML = 
                `<img src="/media/calendar.png" alt="Calendario" style="width:20px; vertical-align:middle;"> ${game.release_date}`;
        }
            
        // Botón de jugar
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.onclick = () => window.open(game.game_url, '_blank');
        }

        // Descripción y Portada
        descriptionArea.innerHTML = `<p>${game.description}</p>`; // Reemplazamos el mensaje de carga con la descripción
        
        document.querySelector('.game-cover img').src = game.thumbnail;
        document.querySelector('.game-cover img').alt = game.title;

        // Imágenes/Screenshots
        const screenshotsGrid = document.querySelector('.screenshots-grid');
        if (screenshotsGrid) {
            screenshotsGrid.innerHTML = ''; 
            if (game.screenshots && game.screenshots.length > 0) {
                game.screenshots.forEach(screenshot => {
                    screenshotsGrid.innerHTML += `<img src="${screenshot.image}" alt="Captura de ${game.title}">`;
                });
            }
        }
        
    } catch (error) {
        console.error("Error al obtener detalles:", error);
        descriptionArea.innerHTML = 
            `<p style="color: red;">Error al cargar los detalles del juego: ${error.message}</p>`;
    }
};

/**
 * Inicialización de la página de Detalles.
 */
const initializeDetailPage = () => {
    const gameId = getGameIdFromUrl();
    
    if (gameId) {
        fetchAndRenderGameDetails(gameId);
    } else {
        const mainDetails = document.querySelector('.details-game');
        if (mainDetails) {
            mainDetails.innerHTML = 
                '<p style="color: red;">Error: No se especificó el ID del juego en la URL.</p>';
        }
    }
};

document.addEventListener('DOMContentLoaded', initializeDetailPage);