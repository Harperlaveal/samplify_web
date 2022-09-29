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
	        .then(data => console.log(data['response']['song']['song_relationships']['0']['songs']))
	        .catch(err => console.error(err));
}