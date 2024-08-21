const modal = document.getElementById('pokemonModal')
const img = document.getElementById('modalImg')
const modalName = document.getElementById('modalName')
const modalDetails = document.getElementById('modalDetails')
const modalTypes = document.getElementById('ModalTypes')
const evolutions = document.getElementById('pokeEvolutions')
const darkBg = document.getElementById('dark')
const closeBtn = document.getElementById('closeIcon')


function cleanText(text) {
    return text
        .replace(/\f/g, '\n')          
        .replace(/\u00ad\n/g, '')      
        .replace(/\u00ad/g, '')        
        .replace(/ -\n/g, ' - ')       
        .replace(/-\n/g, '-')         
        .replace(/\n/g, ' ');  
}

function showModal(pokemon, evolutionChain){
    const imgSrc = pokemon.photo
    img.src = imgSrc;
    modalName.innerHTML = `<span>#${pokemon.number}:</span> ${pokemon.name}`
    modalDetails.innerHTML = cleanText(pokemon.description)
    modalTypes.innerHTML = pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')
    
    if(evolutionChain){
        const evolutionImages = evolutionChain.map(evolution =>{
            return `<li>
                        <img src="${evolution.photo}" alt="${evolution.name}""
                            alt="">
                        <span>${evolution.name}</span>
                    </li>`
        }).join('')
        evolutions.innerHTML = evolutionImages
    }else{
        evolutions.innerHTML = 'No evolutions'
    }

    modal.classList.add('active')
    darkBg.classList.add('active')

}

closeBtn.onclick = () =>{
    modal.classList.remove('active')
    darkBg.classList.remove('active')
}

darkBg.onclick = () =>{
    modal.classList.remove('active')
    darkBg.classList.remove('active')
}



pokemonList.addEventListener('click', function(event){
    const target = event.target.closest('.pokemon')
    if(target){
        const pokemonName = target.getAttribute('data-pokemon-name')
        if(pokemonName){
            PokeApi.pokemonsDetails(pokemonName.toLowerCase())
                .then(pokemon =>{
                    return PokeApi.getPokemonDescription(pokemon.number)
                        .then(description =>{
                            pokemon.description = description
                            return PokeApi.getPokemonEvolution(pokemon.number)
                        })
                        .then(evolutionChain =>{
                            return Promise.all(evolutionChain.map(evolutionName => PokeApi.pokemonsDetails(evolutionName)))
                        })
                        .then(evolutionChainDetails => showModal(pokemon, evolutionChainDetails))
                })
                .catch(error =>{
                    console.error(error)
                    alert('pokemon details not found')
                })
        }else{
            console.error('pokemon name not found')
            alert('pokemon name not found')
        }
    }
})