// import { getCookie } from "LoginController";

const playlistOperations = {
    playlists: [],
    addPlaylist(playlist){
        this.playlists.push(playlist);
    },
    removePlaylist(){
        for(i = 0; i<this.playlists.length; i++){
            pl = this.playlists[i];
            if(pl.isSelected){
                this.playlists.splice(i,1);
                break;
            }
        }
    },
    search(id){
        /* searches the playlist with given id */
        for(i = 0; i<this.playlists.length; i++){
            pl = this.playlists[i];
            if(pl.id == id){
                return pl;
            }
        }
        return null;
    },
    addSong(song, playlist){
        playlist.songs.push(song);
    },
    removeSong(song, playlist){
        index = playlist.songs.indexOf(song);
        playlist.songs.splice(index, 1);
    },
    getPlaylists(){
        return this.playlists;
    },
    selectPlaylist(id){
        for(i = 0; i<this.playlists.length; i++){
            pl = this.playlists[i];
            if(pl.id == id){
                pl.isSelected = true;
            }
            else{
                pl.isSelected = false;
            }
        }
    },
    getSelected(){
        for(i = 0; i<this.playlists.length; i++){
            pl = this.playlists[i];
            if(pl.isSelected){
                return pl;
            }
        }
    }
}