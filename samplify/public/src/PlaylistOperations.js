import { getCookie } from "LoginController";

const playlistOperations = {
    playlist:new Playlist("test_title", "test_uid", []),
    addSong(song){
        this.playlist.songs.push(song);
    },
    removeSong(song){
        index = this.playlist.songs.indexOf(song);
        this.playlist.songs.splice(index, 1);
    },
}