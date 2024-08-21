const pokemonList = document.getElementById('pokemonList')
const loadMoreBtn = document.getElementById('loadMore')
const inputSearch = document.getElementById('inputSearch')
const buttonSeach = document.getElementById('buttonSearch')
const erroBox = document.getElementById('erroBox')
const erroText = document.getElementById('erro-text')
const limit = 12
let offset = 0

//carrega todos os nomes dos pokemos para 
// uma possivel pesquisa
let pokemonNames = []
PokeApi.getAllPokemonNames().then((pokemons) =>{
    pokemonNames = pokemons.map(pokemon => pokemon.name)
})

function convertPokemonToLi(pokemon) {
    return `  <li class="pokemon" data-pokemon-name="${pokemon.name}">
                <img src="${pokemon.photo}"
                    alt="Imagem ${pokemon.name}" id="pokemonImage">
                <div class="details">
                    <span id="pokemonId" class="number">Nº ${pokemon.number}</span>
                    <span id="pokemonName" class="name">${pokemon.name}</span>
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class='type ${type}'>${type}</li>`).join('')}
                    </ol>
                </div>
            </li>`
}



function loadPokemonItens(offset, limit){
    PokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemonList.innerHTML += pokemons.map(convertPokemonToLi).join('')
        loadMoreBtn.innerHTML = `Load More`
    })
}

loadPokemonItens(offset, limit)

loadMoreBtn.onclick = () =>{
    offset += limit
    loadPokemonItens(offset, limit)
}

buttonSeach.onclick = () =>{

    const pesquisa = inputSearch.value.toLowerCase()
    inputSearch.value = ''
    if(!pesquisa){
        pokemonList.innerHTML = ''
        offset = 0
        loadPokemonItens(offset, limit)
        return
    }
    const filteredNames = pokemonNames.filter(name => name.toLowerCase().includes(pesquisa))

    if( filteredNames.length === 0){
        pokemonList.innerHTML = ''
        erroBox.innerHTML = `
        <img src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/054.png" alt="">
        <p>${pesquisa} Não foi encontrado !!!</p>`

        loadMoreBtn.onclick = () =>{
            offset = 0
            loadPokemonItens(offset, limit)
            erroBox.innerHTML = ``
        }
        loadMoreBtn.innerHTML = `Reload`
        return
    }
    pokemonList.innerHTML = ''

    filteredNames.forEach(name => {
        PokeApi.searchPokemon(name).then(pokemon => {
            const types = pokemon.types.map(typeInfo => typeInfo.type.name)
            pokemonData = {
                number: pokemon.id,
                name: pokemon.name,
                types: types,
                photo: pokemon.sprites.other['official-artwork'].front_default,
            }
            pokemonList.innerHTML += convertPokemonToLi(pokemonData)
        }).catch((error) =>{
            console.error(error)
        })
        
    });

}

