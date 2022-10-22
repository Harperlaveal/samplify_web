window.addEventListener("load",init);

function init(){
    bindEvents();  
}

function bindEvents(){
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
