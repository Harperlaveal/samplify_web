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
