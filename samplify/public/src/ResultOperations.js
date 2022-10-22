const resultOperations = {
    results: [],
    selected: [],
    addResult(sample){
        this.results.push(sample);
    },
    removeResults(){
        for(i = 0; i<this.results.length; i++){
            re = this.results[i];
            if(re.isSelected){
                this.selected.push(re);
                this.results.splice(i,1);
                i--; 
            }
        }
    },
    search(id){
        /* searches the result with given id */
        for(i = 0; i<this.results.length; i++){
            re = this.results[i];
            if(re.id == id){
                return re;
            }
        }
        return null;
    },
    getResults(){
        return this.results;
    },
    getSelected(){
        return this.selected;
    },
    clearSelected(){
        this.selected = [];
    },
    clearResults(){
        this.results = [];
    },
    toggleResult(id){
        for(i = 0; i<this.results.length; i++){
            re = this.results[i];
            if(re.id == id){
                re.toggleSelected();
                if(re.isSelected==true){
                    this.selected.push(re);
                }
                else{
                    let index = this.selected.indexOf(re);
                    this.selected.splice(index, 1);
                }
                break;
            }
        }
    }
}