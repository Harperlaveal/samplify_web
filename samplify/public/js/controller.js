window.addEventListener("load", init);

function init(){
    bindEvents();
}

function bindEvents(){
    document.querySelector('#getSongs').addEventListener('click', getSong);
}

function getSong(){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '08849a9ebamsha5f40676fc1520ep15a0a1jsn99c58874253f',
            'X-RapidAPI-Host': 'genius.p.rapidapi.com'
        }
    };
    
    fetch('https://genius.p.rapidapi.com/search?q=Kanye%20West', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}