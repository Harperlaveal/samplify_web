// template functions

window.addEventListener("load",init);

function init(){
    loadId();
    bindEvents();  
}

function bindEvents(){
    document.querySelector('#add-playlist').addEventListener('click',addPlaylist);
    document.querySelector('#delete-playlist').addEventListener('click',deletePlaylist);
    document.querySelector('#edit-playlist').addEventListener('click',updatePlaylist);
}

function addPlaylist(){
    /* adds new playlist and re-displays list */
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

function displayPlaylists(){
    /* displays each playlist in list*/
}

function displayPlaylist(){
    /* displays playlist as clickable button*/
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

import { getAuth } from "firebase/auth";
import { app } from "./LoginController";
import { collection, getDocs } from "firebase/firestore";

document.getElementById("Playlists").addEventListener("click", init);

function init(){
    console.log("Playlists clicked");
    loadPlaylists();
}

function loadPlaylists() {
    playlists = getFromFireBase();
    document.getElementById("playlistContent").innerText = "test";
}

async function getFromFireBase() {
    const querySnapshot = await getDocs(collection(getFirestore(app), "playlists"));
    let playlists = [];
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        playlists.push(new Playlist(doc.data().title, doc.data().uid, doc.data().songs));
    });

    return playlists;
}
