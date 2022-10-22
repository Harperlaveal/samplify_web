window.addEventListener("load", init);

window.onload = function() {

};

function init(){
    bindEvents();
}

function bindEvents(){
    document.querySelector('#song').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          getSamplesFromSong();
        }
    });
    document.querySelector('#search').addEventListener('click', getSamplesFromSong);
    document.querySelector('#search-user-i').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            getPlaylistPage();
        }
    });
    document.querySelector('#search-playlist').addEventListener('click', getPlaylistPage);
}

async function getPlaylistPage(){
    let search = document.getElementById("search-user-i").value;
    window.location.replace('/playlists/' + search);
}

async function getSamplesFromSong(){
    document.querySelector('#samples').innerHTML = null;
    document.querySelector('#showing-results').innerHTML = null;
    resultOperations.clearResults();
    document.getElementById("add").disabled = true;
    let search = document.getElementById("song").value;
    if(search.trim().length != 0){
        console.log(search);
        let id;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '08849a9ebamsha5f40676fc1520ep15a0a1jsn99c58874253f',
                'X-RapidAPI-Host': 'genius.p.rapidapi.com'
            }
        };
        
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
}

function readSamples(data){
    document.querySelector('#samples').innerHTML = null;
    document.querySelector('#showing-results').innerHTML = null;
    let samples = data['response']['song']['song_relationships']['0']['songs'];

    let full_title = data['response']['song']['full_title'];

    var showing = document.createElement("div");
    showing.innerText = "Showing samples used in: " +  full_title;
    document.getElementById("showing-results").appendChild(showing);


    if(samples.length!=0){
        for(let i = 0; i<samples.length; i++){
            let sample = samples[i];
            let samp = new Sample();
            samp['title'] = sample['title'];
            samp['artist'] = sample['artist_names'];
            samp['imgUrl'] = sample['header_image_thumbnail_url'];
            samp['id'] = sample['id'];

            resultOperations.addResult(samp);

            displaySample(samp);
        }
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
    let tr = this.parentNode.parentNode;
    let selected = resultOperations.search(id);
    if(!selected.isSelected){
        var table = document.getElementById("search-table");
        for (var i = 0, row; row = table.rows[i]; i++) {
            row.setAttribute("class", "table-default");
        }
        tr.setAttribute("class", "table-primary");

        document.getElementById('form-title').value = selected.title;
        document.getElementById('form-artist').value = selected.artist;
        document.getElementById('form-img').value = selected.imgUrl;
        document.getElementById("add").disabled = false;
    }
    else{
        tr.setAttribute("class", "table-default");
        document.getElementById("add").disabled = true;
    }
    resultOperations.toggleResult(id);
}