// template functions

window.addEventListener("load",init);

function init(){
    bindEvents();  
    //loadPlaylists();
}

function bindEvents(){
    document.querySelector('#create').addEventListener('click',addPlaylist);
    document.querySelector('#delete').addEventListener('click',deletePlaylist);
    document.querySelector('#edit').addEventListener('click',updatePlaylist);
}

function addPlaylist(){
    /* adds new playlist and re-displays list */
    let pl = new Playlist();

    let playname = document.getElementById('pl-in-txt').value;

    if(playname!=''){
        pl['title'] = document.getElementById('pl-in-txt').value;

        playlistOperations.addPlaylist(pl);

        displayPlaylist(pl);

        document.getElementById('pl-in-txt').value = "";

        updateOptions();
    }
}

function updateOptions(){
    document.querySelector('#select-pl').innerHTML = null;
    let select = document.getElementById('select-pl');
    let list = playlistOperations.getPlaylist();
    for(let i=0;i<list.length;i++){
        console.log(list[i]['title'])
        let opt = document.createElement('option');
        opt.value = list[i]['title'];
        opt.innerHTML = list[i]['title'];
        select.appendChild(opt);
    }
}

function deletePlaylist(){
    /* deletes playlist and re-displays view */
}

function updatePlaylist(){
    /* updates playlist and re-displays view */
}

function deleteSample(){
    /* deletes sample and re-displays view */
}

function displayPlaylists(playlists){
    /* displays each playlist in list*/
    document.querySelector('#pl-items').innerHTML = null; //first clears table
    for(i = 0; i<playlists.length; i++){
        displayPlaylist(playlists[i]);
    }
}

function displayPlaylist(pl){
    /* displays playlist as clickable button*/
    var tbody = document.querySelector('#pl-items');
    var tr = tbody.insertRow();
    let cell = tr.insertCell(0);
    cell.innerText = pl['title'];
}

function createIcon(className,fn, id){
    /* creates icons for selection */
    
}

function displaySamples(){
    /* displays each sample in list*/
}

function displaySample(){
    /* displays sample information as a row */

}

function changeView(){
    /* changes playlist view depending on which playlist is clicked */
}

// firebase

// import { getAuth } from "firebase/auth";
// import { app } from "./LoginController";
// import { collection, getDocs } from "firebase/firestore";

// document.getElementById("Playlists").addEventListener("click", init);

// function loadPlaylists() {
//     playlists = getFromFireBase();
//     document.getElementById("playlistContent").innerText = "test";
// }

// async function getFromFireBase() {
//     const querySnapshot = await getDocs(collection(getFirestore(app), "playlists"));
//     let playlists = [];
//     querySnapshot.forEach((doc) => {
//         console.log(doc.id, " => ", doc.data());
//         playlists.push(new Playlist(doc.data().title, doc.data().uid, doc.data().songs));
//     });

//     return playlists;
// }
