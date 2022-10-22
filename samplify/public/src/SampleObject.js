class Sample{
    constructor(title, artist, id, imgUrl){
         this.title = title;
         this.artist = artist;
         this.img = imgUrl;
         this.isSelected = false;
         this.id = id;
    }
    toggleSelected = () => {
        this.isSelected = !this.isSelected;
    }
}