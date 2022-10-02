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
        pl['id'] = makeId();

        playlistOperations.addPlaylist(pl);

        displayPlaylist(pl);

        document.getElementById('pl-in-txt').value = "";

        updateOptions();
    }
}

function makeId(){
    let rand = Math.floor(Math.random() * 100);
    let date = Date.now();

    return rand+"_"+date;
}

function updateOptions(){
    document.querySelector('#select-pl').innerHTML = null;
    let select = document.getElementById('select-pl');
    let list = playlistOperations.getPlaylists();
    for(let i=0;i<list.length;i++){
        let opt = document.createElement('option');
        opt.value = list[i]['title'];
        opt.innerHTML = list[i]['title'];
        select.appendChild(opt);
    }
    if(list.length==0){
        let opt = document.createElement('option');
        opt.innerHTML = 'Choose Playlist';
        select.appendChild(opt);
    }
}

function deletePlaylist(){
    /* deletes playlist and re-displays view */
    playlistOperations.removePlaylist();

    document.getElementById("pl-name").innerHTML = null;
    document.getElementById("pl-desc").innerHTML = null;
    displayPlaylists();
    updateOptions();
}

function updatePlaylist(){
    /* updates playlist and re-displays view */
    pl = playlistOperations.getSelected();

    pl['title'] = document.getElementById("pl-name").innerHTML;
    pl['desc'] = document.getElementById("pl-desc").innerHTML;

    displayPlaylists();
    updateOptions();
}

function deleteSample(){
    /* deletes sample and re-displays view */
}

function displayPlaylists(){
    /* displays each playlist in list*/
    console.log("hello")
    let lists = playlistOperations.getPlaylists();
    document.querySelector('#pl-items').innerHTML = null; //first clears table
    for(i = 0; i<lists.length; i++){
        displayPlaylist(lists[i]);
    }
}

function displayPlaylist(pl){
    /* displays playlist as clickable button*/
    var list = document.querySelector('#pl-items');
    list.appendChild(createButton(pl));
}

function createButton(pl){
    var button = document.createElement("button");
    button.className = "btn btn-light";
    button.innerHTML = pl['title'];
    button.setAttribute("data-itemid", pl['id']) ;
    button.onclick = toggle;

    return button;
}

function toggle(){
    //console.log(pl['title'])
    let id = this.getAttribute('data-itemid');
    playlistOperations.selectPlaylist(id);
    changeView();
    
}

function changeView(){
    /* changes playlist view depending on which playlist is clicked */
    let pl = playlistOperations.getSelected();

    document.querySelector('#pl-name').innerHTML = pl['title'];
    document.querySelector('#pl-desc').innerHTML = pl['desc'];
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
