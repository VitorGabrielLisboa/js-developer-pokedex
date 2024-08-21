const PokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.name = pokeDetail.name
    pokemon.number = pokeDetail.id

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    
    pokemon.types = types

    pokemon.photo = pokeDetail.sprites.other['official-artwork'].front_default

    return pokemon
}

PokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailToPokemon)
}

PokeApi.getPokemons = (offset = 0, limit = 12) =>{
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
    .then((response) =>response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(PokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails)
    .catch((err) => console.error(err))
}


PokeApi.pokemonsDetails = (nameOrId) =>{
    const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`;
    return fetch(url)
        .then((response) =>{
            if(!response.ok){
                
            }
            return response.json()
        })
        .then(convertPokeApiDetailToPokemon)
}
PokeApi.searchPokemon = (nameOrId) =>{
    const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`;
    return fetch(url)
        .then((response) =>{
            if(!response.ok){
                
            }
            return response.json()
        })
}
//função para pegar todos os pokemons para pesquisa
PokeApi.getAllPokemonNames = (limit = 10000) =>{
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    return fetch(url)
        .then((response) => response.json())
        .then((data) => data.results)

}
// função para adquirir a cadeia de evolução
PokeApi.getPokemonEvolution = (pokemonId) =>{
    return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
        .then((response) => response.json())
        .then(speciesData =>{
            const evolutionChainUrl = speciesData.evolution_chain.url
            return fetch(evolutionChainUrl)
                .then(responseEvolution => responseEvolution.json())
                .then(evolutionChainData =>{
                    const evolutionChain = []
                    let currentEvolution = evolutionChainData.chain
                    do{
                        const evolutionName = currentEvolution.species.name
                        evolutionChain.push(evolutionName)
                        currentEvolution = currentEvolution.evolves_to[0]
                    }while(currentEvolution && currentEvolution.hasOwnProperty('evolves_to'))
                    return evolutionChain
                })
        })
}

//função para obter a descrição do pokémon
PokeApi.getPokemonDescription = (pokemonId) =>{
    return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
        .then((response) => response.json())
        .then(speciesData =>{
            return speciesData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text
        })
}

