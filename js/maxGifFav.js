var modal = document.getElementById("modalFav")


function closeModal(){
    modal.style.display = 'none';
}

async function getGifById(id) {
    try {
        const response = await fetch(`/api/giphy?endpoint=gifs/${id}`);
        const data = await response.json();
        if (data.data) {
            showGifDetails(data.data);
        }
    } catch (error) {
        console.error('Error fetching GIF by ID:', error);
    }
}

async function searchByIdFav(gifId){
    try{
        const response = await fetch(`/api/giphy?endpoint=gifs/${gifId}`);
        const data = await response.json();
        searchByIdAndLoadFav(data)
        eventsMaxGifFav(data.data)
    }catch(error){
        console.log('Error', error);
    }
}

async function searchByIdAndLoadFav(gifWithId){
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
                        <div id="${gifWithId.data.id}-add-max-gif" class="icons icon-heart--active"><i class="icon-heart"></i></div>
                        <div id="${gifWithId.data.id}-download-max-gif" class="icons icon-download"><i class="icon-download"></i></div>
                    </div>
                </div>
            </div>
        </div>`;

     modal.innerHTML = resultHTML
     modal.style.display = 'block';
}

function addToLSMaxGifFav(name,value) {
    let existing = localStorage.getItem(name);
    existing = existing ? JSON.parse(existing) : [];
    existing.push(value);
    localStorage.setItem(name,JSON.stringify(existing)); 
}

function addFavMaxFav(gif) {
    let elementMax = document.getElementById(`${gif.id}-add-max-gif`)

    if(elementMax.classList.contains('icon-heart--active') == false){
        elementMax.classList.add('icon-heart--active')
        addToLSMaxGifFav('Favourites',gif)
    }else{
        elementMax.classList.remove('icon-heart--active')
        elementMax.classList.add('icon-heart')
        rmFavMaxFav(gif)
    }
}

async function downloadFavMaxFav(gif){
    let a = document.createElement('a');
    let response = await fetch(`${gif.images.downsized.url}`);
    let file = await response.blob();
    a.download = `${gif.title}`;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
}

function rmFavMaxFav(gif) {
    let data = JSON.parse(localStorage.getItem('Favourites'))
    data.forEach((item,index) => item.id === gif.id ? data.splice(index,1): null)
    localStorage.setItem('Favourites',JSON.stringify(data))
}

function eventsMaxGifFav(gif){
    const toggleEvent = e => {
        if (e.currentTarget.id == `${gif.id}-add-max-gif`){
            addFavMaxFav(gif);
        }
        if (e.currentTarget.id == `${gif.id}-download-max-gif`){
            downloadFavMaxFav(gif)
        }
    };
    const handlerEventsForEacrhIcon = document.querySelectorAll(".icons");
    handlerEventsForEacrhIcon.forEach( btn => {
        btn.addEventListener("click",toggleEvent)
    }) 
}

export async function getGifWithInput(text, pag) {
    try {
        const apiURL = `/api/giphy?endpoint=gifs/search&q=${encodeURIComponent(text)}&limit=12&offset=${pag}&rating=g&lang=en`;
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching search GIFs:', error);
        return { data: [] }; // Return empty data structure to prevent undefined errors
    }
}

export async function searchById(id) {
    try {
        const response = await fetch(`/api/giphy?endpoint=gifs/${id}`);
        const data = await response.json();
        if (data.data) {
            const modal = document.getElementById('modal');
            let resultHTML = '';
            const url = data.data.images.fixed_width.url;

            resultHTML += `<div class="cross" onclick="closeModal()">X</div>
            <div class="container">
                <div class="max-image-text">
                    <div class="image-max">
                        <img src="${url}" alt="${data.data.title}">
                    </div>
                    <div class="icon-text">
                        <div class="max-text">
                            <div class="text-card-user">${data.data.username !== '' ? data.data.username : 'User'}</div>
                            <h3 class="text-card-title">${data.data.title}</h3>
                        </div>
                        <div class="iconos">
                            <div id="${data.data.id}-add-max-gif" class="icons icon-heart"></div>
                            <div id="${data.data.id}-download-max-gif" class="icons icon-download"></div>
                        </div>
                    </div>
                </div>
            </div>`;

            modal.innerHTML = resultHTML;
            modal.style.display = 'block';

            // Add event listeners
            const favButton = document.getElementById(`${data.data.id}-add-max-gif`);
            const downloadButton = document.getElementById(`${data.data.id}-download-max-gif`);

            favButton.addEventListener('click', () => addFavMax(data.data));
            downloadButton.addEventListener('click', () => downloadFavMax(data.data));
        }
    } catch (error) {
        console.error('Error fetching GIF by ID:', error);
    }
}
