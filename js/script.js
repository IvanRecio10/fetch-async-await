const baseUrl = 'https://pokeapi.co/api/v2/pokemon';
const limit = 10;  
let offset = 0;  

const app = document.getElementById('app');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');

const getPokemons = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('No se pudieron obtener los Pokémon');
        const data = await response.json();

        displayPokemons(data.results);
    } catch (error) {
        app.innerHTML = `<p>Error: ${error.message}</p>`;
    }
};

const displayPokemons = (pokemons) => {
    app.innerHTML = '';  

    pokemons.forEach(async (pokemon) => {
        try {
            const res = await fetch(pokemon.url);  
            const pokeData = await res.json();
            app.innerHTML += `
                <div class="pokemon-card">
                    <h3>${pokeData.name.toUpperCase()}</h3>
                    <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
                    <p>ID: ${pokeData.id}</p>
                    <p>Altura: ${pokeData.height}</p>
                    <p>Peso: ${pokeData.weight}</p>
                </div>
            `;
        } catch (error) {
            console.error('Error al obtener detalles del Pokémon:', error);
        }
    });
};

const searchPokemon = async () => {
    const query = searchInput.value.toLowerCase();
    if (!query) return;  

    try {
        const res = await fetch(`${baseUrl}/${query}`);
        if (!res.ok) throw new Error('Pokémon no encontrado');
        const pokeData = await res.json();

        app.innerHTML = `
            <div class="pokemon-card">
                <h3>${pokeData.name.toUpperCase()}</h3>
                <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
                <p>ID: ${pokeData.id}</p>
                <p>Altura: ${pokeData.height}</p>
                <p>Peso: ${pokeData.weight}</p>
            </div>
        `;
    } catch (error) {
        app.innerHTML = `<p>${error.message}</p>`;
    }
};

prevBtn.addEventListener('click', () => {
    if (offset > 0) {
        offset -= limit;
        getPokemons(`${baseUrl}?offset=${offset}&limit=${limit}`);
    }
});

nextBtn.addEventListener('click', () => {
    offset += limit;
    getPokemons(`${baseUrl}?offset=${offset}&limit=${limit}`);
});

searchBtn.addEventListener('click', searchPokemon);

resetBtn.addEventListener('click', () => {
    searchInput.value = '';  
    offset = 0;  
    getPokemons(`${baseUrl}?offset=${offset}&limit=${limit}`);  
});

getPokemons(`${baseUrl}?offset=${offset}&limit=${limit}`);
