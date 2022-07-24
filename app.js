const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

function getContent() {
    const url = `https://pokemondb.net/pokedex/all`;
    request(url, function (error, response, body) {
        if (error) {
            console.log(error);
            return;
        }

        const dom = new JSDOM(body);
        const pokemonsData = [];

        const pokemons = dom.window.document.querySelectorAll('#pokedex > tbody > tr');
        for (const pokemon of pokemons) {
            const singlePokemonData = {};

            const queryPokedexNumber = pokemon.querySelector('.infocard-cell-data');
            if (queryPokedexNumber) {
                singlePokemonData.pokedexNumber = queryPokedexNumber.textContent;
            }

            const queryEvolutionName = pokemon.querySelector('.text-muted');
            if (!queryEvolutionName) {
                const queryName = pokemon.querySelector('.cell-name');
                if (queryName) {
                    singlePokemonData.name = queryName.textContent;
                }

            } else {
                singlePokemonData.evolutionName = queryEvolutionName.textContent;
            }

            const queryType = pokemon.querySelectorAll('.type-icon');
            if (queryType) {
                singlePokemonData.types = [];
                for (const type of queryType) {
                    singlePokemonData.types.push(type.textContent);
                }
            }

            const queryTotal = pokemon.querySelector('.cell-total');
            if (queryTotal) {
                singlePokemonData.total = queryTotal.textContent;
            }

            const queryAttributes = pokemon.querySelectorAll('.cell-num');
            if (queryAttributes) {
                singlePokemonData.hp = queryAttributes[1].textContent;
                singlePokemonData.attack = queryAttributes[2].textContent;
                singlePokemonData.defense = queryAttributes[3].textContent;
                singlePokemonData.spAtk = queryAttributes[4].textContent;
                singlePokemonData.spDef = queryAttributes[5].textContent;
                singlePokemonData.speed = queryAttributes[6].textContent;
            }

            pokemonsData.push(singlePokemonData);
        }
        fs.writeFileSync('./pokemons.json', JSON.stringify(pokemonsData, null, 2), 'utf8');

    })
};

getContent();
console.log("Confira a Pokedex no arquivo 'pokemons.json' na sua pasta! ");