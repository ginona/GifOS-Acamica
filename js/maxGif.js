var modal = document.getElementById("modal")

// var crossBtn = document.getElementById("cierreModal")

// crossBtn.addEventListener('click', closeModal)


function closeModal(){
    modal.style.display = 'none';
}


async function searchById(gifId){
    const api_url = 'https://api.giphy.com/v1/gifs/'+gifId+'?api_key=TwJ1SaQHCIBd0qczJHRc3ioNpKdTxEYs';

    const response = await fetch(api_url);
    const data = await response.json();
    // return data
    searchByIdAndLoad(data)
    events4(data)
}

// async function searchByIdAndLoad(gifId){
//     let gifWithId = await searchById(gifId);
//     //agregar variable en trendingcards para indicar el tipo y que vaya por ella y reciclar
// }

async function searchByIdAndLoad(gifWithId){
    // let gifWithId = await searchById(gifId);
    // events4(gifWithId)
    let resultHTML = '';
         const url = gifWithId.data.images.fixed_width.url

        resultHTML += `<div class="cross" onclick="closeModal()">X</div>
        <div class="container">
            <div class="max-image-text">
                <div class="image-max">
                    <img src="${url}" alt="${gifWithId.data.title}">
                </div>
                <div class="icon-text">
                    <div class="max-text">
                        <div class="text-card-user">${gifWithId.data.username !== '' ? gifWithId.data.username : 'User' }</div>
                        <h3 class="text-card-title">${gifWithId.data.title}</h3>
                    </div>
                    <div class="iconos">
                    <div id="${gifWithId.data.id}-add-max-gif" class="icons icon-heart"></div>
                    <div id="${gifWithId.data.id}-download-max-gif" class="icons icon-download"></div>
                    </div>
                </div>
            </div>
        </div>`;

     modal.innerHTML = resultHTML
     modal.style.display = 'block';
}


function addToLS3(name,value) {
    let existing = localStorage.getItem(name);
    existing = existing ? JSON.parse(existing) : [];
    existing.push(value);
    localStorage.setItem(name,JSON.stringify(existing)); 
}

function addFavourites3(gif) {
    document.getElementById(`${gif.data.id}-add-max-gif`).classList.add('icon-heart--active')
    addToLS3('Favourites',gif)
}

async function downloadFavourites3(gif){
    let a = document.createElement('a');
    let response = await fetch(`${gif.data.images.downsized.url}`);
    let file = await response.blob();
    a.download = `${gif.data.title}`;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
}
function removeFavourites3(gif) {
    let data = JSON.parse(localStorage.getItem('Favorites'))
    data.forEach((ítem,index) => ítem.id === gif.id ? data.splice(index,1): null)
    localStorage.setItem('Favorites',JSON.stringify(data))
    document.getElementById(gif.id).remove()
}

function events4(gif){
    // let algo = `${gif.id}-download`
    // let elemento = document.getElementById(algo);
    // elemento.addEventListener("click", downloadFavourites3(gif))
    const toggleEvent = e => {
        if (e.currentTarget.id == `${gif.data.id}-remove`){
            removeFavourites3(gif);
        }
        if (e.currentTarget.id == `${gif.data.id}-add-max-gif`){
            addFavourites3(gif);
        }
        if (e.currentTarget.id == `${gif.data.id}-download-max-gif`){
            downloadFavourites3(gif)
        }
    };
    const handlerEventsForEacrhIcon = document.querySelectorAll(".icons");
    handlerEventsForEacrhIcon.forEach( btn => {
        btn.addEventListener("click",toggleEvent)
    }) 
}

// function trtrending3(data){
//     data.data.map(function(gif){ let card =  events3(gif)
//         return card;
//     }).join('');
// }
