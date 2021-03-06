
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
            // document.getElementById('repeat').style.display = 'none'
            
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
    containerVideo.innerHTML = `<h1 id="askVideoT">¿Nos das acceso <br>a tu cámara?</h1>
    <p id="askVideoP">El acceso a tu camara será válido sólo <br>por el tiempo en el que estés creando el GIFO.</p>`
    containerVideo.appendChild(videoRecording)
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 300 },
            width: {max: 500}
        }
    }).then(async function(stream){
        videoRecording.srcObject = stream
        videoRecording.play()
        catchingSteps(2)
        const recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function(){
                console.log('started')
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
    })
}


const successCard = `
<div id="video-card-success" class="video-card hideBtn">
<img src="/img/loader.svg" alt="loader">
<h3>GIFO subido con éxito</h3>
</div>
`

async function uploadGif (file) {
    document.getElementById('uploading').style.display = 'none'
    let vidWidth = document.getElementsByTagName('video')[0].offsetWidth;
    let vidHeight = document.getElementsByTagName('video')[0].offsetHeight;
    let containerVideo = document.getElementById('container-video')
    let cardLoad = document.createElement('div')
    cardLoad.id = 'video-card-loading'
    cardLoad.style.width = `${vidWidth}px`
    cardLoad.style.height = `${vidHeight}px`
    cardLoad.className = 'video-card'
    cardLoad.innerHTML = `<img src="/img/loader.svg" alt="loader"><br>
                          <h3>Estamos subiendo tu GIFO</h3>`
    containerVideo.appendChild(cardLoad)
    let postGif = await postGifos(file);
    addingLS('MyGifs',postGif.data.id)
    cardLoad.innerHTML = `<img src="/img/ok.svg" alt="loader"><br>
                          <h3>GIFO subido con éxito</h3>`
                          console.log("Uploaded")
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
    const apiURL = `https://upload.giphy.com/v1/gifs?api_key=TwJ1SaQHCIBd0qczJHRc3ioNpKdTxEYs`;
    try {
        const OtherParam = {
            method: "POST",
            body: file
        }
        const response = await fetch(apiURL,OtherParam);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Fetch Error',error);
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