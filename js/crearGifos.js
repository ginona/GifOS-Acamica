document.getElementById('starting').addEventListener('click',function(){
    startingRecord()
})

function catchingSteps(value){
    switch (value) {
        case 1:
            document.getElementById('starting').style.display = 'none'
            document.getElementById('step-1').classList.add('step-selected')
          break
        case 2:
          document.getElementById('askVideoT').remove()
          document.getElementById('askVideoP').remove()
          document.getElementById('step-1').classList.remove('step-selected')
          document.getElementById('step-2').classList.add('step-selected')
          document.getElementById('recording').style.display= 'block'
          break;
        case 3:
            document.getElementById('recording').style.display = 'none'
            document.getElementById('timing').style.display = 'block'
            document.getElementById('container-steps').style.transform = 'translateX(5%)'
            document.getElementById('finishing').style.display = 'block'
            break;
        case 4:
            document.getElementById('finishing').style.display = 'none'
            document.getElementById('timing').style.display= 'none'
            document.getElementById('repeat').style.display= 'block'
            document.getElementById('container-steps').style.transform = 'translateX(0%)'
            document.getElementById('step-1').style.transform = 'translateX(200%)'
            document.getElementById('step-2').style.transform = 'translateX(200%)'
            document.getElementById('step-3').style.transform = 'translateX(200%)'
            document.getElementById('uploading').style.display = 'block'
            break;
        case 5:
            document.getElementById('step-2').classList.remove('step-selected')
            document.getElementById('step-3').classList.add('step-selected')
            break;
        case 6:
            document.getElementById('uploading').style.display = 'none'
            document.getElementById('step-3').classList.remove('step-selected')
            break;
        default:
          console.log("Error")
          break;
      }
}

function startingRecord(){
    catchingSteps(1)
    let videoRecording = document.createElement('video')
    let containerVideo = document.getElementById('container-video')
    
    // Mostrar mensaje de solicitud de cámara
    containerVideo.innerHTML = `
        <div class="camera-request">
            <h1 id="askVideoT">Do you allow us <br>to access your camera?</h1>
            <p id="askVideoP">Camera access will only be valid <br>while you're creating the GIF.</p>
            <div class="camera-status" id="camera-status"></div>
        </div>
    `
    containerVideo.appendChild(videoRecording)

    // Actualizar estado de la cámara
    const cameraStatus = document.getElementById('camera-status')
    cameraStatus.innerHTML = '<p>Requesting camera access...</p>'

    // Solicitar acceso a la cámara
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 300 },
            width: {max: 500}
        }
    }).then(async function(stream){
        // Cámara accedida exitosamente
        cameraStatus.innerHTML = '<p style="color: green;">Camera access granted!</p>'
        videoRecording.srcObject = stream
        videoRecording.play()
        catchingSteps(2)
        
        const recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            height: 240,
            onGifRecordingStarted: function(){
                console.log('Recording started')
            },
        })

        let recording = document.getElementById('recording')
        recording.addEventListener('click', function(){
            videoRecording.play()
            recorder.startRecording()
            catchingSteps(3)
            clock(true)
        })

        let finishRecord = document.getElementById('finishing')
        let blob
        finishRecord.addEventListener('click', function(){
            setTimeout(() => {
                recorder.stopRecording(function(){
                    blob = recorder.getBlob()
                    // Stop all tracks to release camera
                    stream.getTracks().forEach(track => track.stop())
                })
                videoRecording.pause()
                catchingSteps(4)
                clock(false)
            }, 1000);
        })

        let uploadRecord = document.getElementById('uploading')
        uploadRecord.addEventListener('click', async function(){
            catchingSteps(5)
            let form = new FormData();
            form.append('file', blob, 'myGif.gif')
            uploadGif(form)
        })
    }).catch(function(error) {
        console.error('Error accessing camera:', error);
        // Mostrar mensaje de error específico según el tipo de error
        let errorMessage = 'Please make sure you have granted camera permissions and try again.'
        if (error.name === 'NotAllowedError') {
            errorMessage = 'Camera access was denied. Please allow camera access and try again.'
        } else if (error.name === 'NotFoundError') {
            errorMessage = 'No camera found. Please connect a camera and try again.'
        } else if (error.name === 'NotReadableError') {
            errorMessage = 'Camera is in use by another application. Please close other applications using the camera and try again.'
        }
        
        containerVideo.innerHTML = `
            <div class="camera-error">
                <h1>Camera Access Error</h1>
                <p>${errorMessage}</p>
                <button onclick="window.location.reload()" class="button-cgf">Try Again</button>
            </div>
        `;
    })
}

const successCard = `
<div id="video-card-success" class="video-card">
    <img src="/img/loader.svg" alt="loader">
    <h3>GIF uploaded successfully!</h3>
</div>
`

const errorCard = `
<div id="video-card-error" class="video-card">
    <img src="/img/icon-fav-sin-contenido.svg" alt="error">
    <h3>Error uploading GIF. Please try again.</h3>
</div>
`

async function uploadGif(formData) {
    const containerVideo = document.getElementById('container-video');
    containerVideo.innerHTML = successCard;
    
    try {
        const response = await fetch('/api/giphy?endpoint=gifs/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.data) {
            handleUploadSuccess(data.data);
        } else {
            throw new Error('No data received from server');
        }
    } catch (error) {
        console.error('Error uploading GIF:', error);
        containerVideo.innerHTML = errorCard;
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
}

function handleUploadSuccess(data) {
    const containerVideo = document.getElementById('container-video');
    containerVideo.innerHTML = `
        <div class="video-card">
            <img src="${data.images.fixed_width.url}" alt="uploaded gif">
            <h3>GIF uploaded successfully!</h3>
            <p>Your GIF has been saved to My GIFs</p>
        </div>
    `;
    
    // Save to local storage
    addingLS('myGifos', data);
    
    // Redirect after 3 seconds
    setTimeout(() => {
        window.location.href = './misGifos.html';
    }, 3000);
}

document.getElementById('repeat').addEventListener('click', function(){
    window.location.reload();
})

function addingLS(name,value) {
    let createdGifs = localStorage.getItem(name)
    createdGifs = createdGifs ? JSON.parse(createdGifs) : []
    createdGifs.push(value)
    localStorage.setItem(name,JSON.stringify(createdGifs))
}

function calculateTimeDuration(secs) {
    let hr = Math.floor(secs / 36e2);
    let min = Math.floor((secs - (hr * 36e2)) / 60);
    let sec = Math.floor(secs - (hr * 36e2) - (min * 60));
    if (min < 10) 
        min = '0' + min
    if (sec < 10) 
        sec = '0' + sec
    return hr + ':' + min + ':' + sec;
}

function clock(recorder) {
    let dateStarted = new Date().getTime();
    let time = document.getElementById('timing');
    (function looper() {
        if (!recorder) {
            return;
        }
        time.innerHTML = calculateTimeDuration((new Date().getTime() - dateStarted) / 10e2);
        setTimeout(looper, 10e2);
    })();
}

async function postGifos(file){
    try {
        const response = await fetch('/api/giphy?endpoint=gifs', {
            method: "POST",
            body: file
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Fetch Error', error);
    }
}

function showSearch(){
    let y = window.scrollY
    if(y!== 0){
        document.querySelector('.header').style.boxShadow = '1px 1px 4px 0 rgba(0, 0, 0, .1)'
    }else{
        document.querySelector('.header').style.boxShadow = 'none'
    }
}
window.addEventListener("scroll", showSearch)

async function getGifWithInput(text, pag) {
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

async function searchById(id) {
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