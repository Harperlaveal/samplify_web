window.addEventListener("load", init);

function init(){
    bindEvents();
}

function bindEvents(){
    document.querySelector('#search').addEventListener('click', getSamplesFromSong);
}

async function getSamplesFromSong(){
    let search = document.getElementById("song").value;
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
    await fetch('https://genius.p.rapidapi.com/search?q=' + search, options)
        .then(response => response.json())
        .then(data => id = data['response']['hits']['0']['result']['id'])
        .catch(err => console.error(err));
        fetch('https://genius.p.rapidapi.com/songs/' + id, options)
	        .then(response => response.json())
	        .then(data => displaySamples(data))
	        .catch(err => console.error(err));
}

function displaySamples(data){
    document.querySelector('#samples').innerHTML = null;
    samples = data['response']['song']['song_relationships']['0']['songs'];
    for(i = 0; i<samples.length; i++){
        sample = samples[i];
        title = sample['title'];
        artist = sample['artist_names'];
        img = sample['header_image_thumbnail_url'];

        displaySample(title, artist, img)
    }
}

function displaySample(title, artist, img){
    var tbody = document.querySelector('#samples');
    var tr = tbody.insertRow();
    tr.insertCell(0).innerText = title;
    tr.insertCell(1).innerText = artist;
    tr.insertCell(2).appendChild(createImage(img));
    tr.insertCell(3).appendChild(createSelect(title));
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
    //let id = this.getAttribute('data-itemid');
    let tr = this.parentNode.parentNode;
    tr.classList.toggle('alert-success');
}