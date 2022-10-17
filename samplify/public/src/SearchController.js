window.addEventListener("load", init);

window.onload = function() {

};

function init(){
    bindEvents();
}

function bindEvents(){
    document.querySelector('#search').addEventListener('click', getSamplesFromSong);
    document.querySelector('#add').addEventListener('click', addSamplesToPlaylist);
}

function addSamplesToPlaylist(){
    var select = document.getElementById("select-pl");
    var value = select.value;

    console.log(value);

    let pl = playlistOperations.search(value);

    if(pl!=null){
        resultOperations.removeResults();
        sel = resultOperations.getSelected();
        for(let i = 0; i<sel.length; i++){
            playlistOperations.addSong(sel[i], pl);
        }
        resultOperations.clearSelected();
        document.querySelector('#samples').innerHTML = null;
        displaySamples();
    }
}

async function getSamplesFromSong(){
    let search = document.getElementById("song").value;
    if(search.trim().length != 0){
        console.log(search);
        let id;
        let sample;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '08849a9ebamsha5f40676fc1520ep15a0a1jsn99c58874253f',
                'X-RapidAPI-Host': 'genius.p.rapidapi.com'
            }
        };
        resultOperations.clearResults();
        document.querySelector('#samples').innerHTML = null;
        const loader = document.querySelector('#loader');
        loader.style.display = 'block';
        await fetch('https://genius.p.rapidapi.com/search?q=' + search, options)
            .then(response => response.json())
            .then(data => id = data['response']['hits']['0']['result']['id'])
            .catch(err => console.error(err));
            fetch('https://genius.p.rapidapi.com/songs/' + id, options)
                .then(response => response.json())
                .then(data => readSamples(data))
                .catch(err => console.error(err));
    }
    else{
        resultOperations.clearResults();
        document.querySelector('#samples').innerHTML = null;
    }
}

function readSamples(data){
    let samples = data['response']['song']['song_relationships']['0']['songs'];

    if(samples.length!=0){
        for(let i = 0; i<samples.length; i++){
            let sample = samples[i];
            let samp = new Sample();
            samp['title'] = sample['title'];
            samp['artist'] = sample['artist_names'];
            samp['imgUrl'] = sample['header_image_thumbnail_url'];
            samp['id'] = sample['id'];

            resultOperations.addResult(samp);
        }
        
        displaySamples();
        const loader = document.querySelector('#loader');
        loader.style.display = 'none';
        document.getElementById("song").value = null;
    }
    else{
        noSamples();
    }
}

function noSamples(){
    const loader = document.querySelector('#loader');
    loader.style.display = 'none';
    var tag = document.createElement("div");
    tag.innerHTML = "No samples found :(";
    tag.setAttribute("style","padding:25px;")
    document.querySelector('#samples').appendChild(tag);
}

function displaySamples(){
    let list = resultOperations.getResults();
    for(let i = 0; i<list.length; i++){
        sample = list[i];
        displaySample(sample);
    }
}

function displaySample(sample){
    var tbody = document.querySelector('#samples');
    var tr = tbody.insertRow();
    tr.insertCell(0).innerText = sample['title'];
    tr.insertCell(1).innerText = sample['artist'];
    tr.insertCell(2).appendChild(createImage(sample['imgUrl']));
    tr.insertCell(3).appendChild(createSelect(sample['id']));
}

function createImage(url){
       var imgTag = document.createElement("img");
       imgTag.className = "samp-img";
       imgTag.setAttribute("src", url) ;
       imgTag.setAttribute("width", 100);
       imgTag.setAttribute("height", 100) ;
   
       return imgTag;
}

function createSelect(id){
       var iTag = document.createElement("i");
       iTag.className = "fas fa-cart-plus";
       iTag.addEventListener('click',toggle);
       iTag.setAttribute("data-itemid", id) ;
       iTag.setAttribute("style", "font-size:50px;") ;
   
       return iTag;
}

function toggle(){
    let id = this.getAttribute('data-itemid');
    resultOperations.toggleResult(id);
    let tr = this.parentNode.parentNode;
    tr.classList.toggle('alert-primary');
}