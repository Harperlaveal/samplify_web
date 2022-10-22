window.addEventListener("load",init);

let sampids = [];

function init(){
    bindEvents();  
}

function bindEvents(){
    document.querySelectorAll('.fa-minus').forEach(item => {
        item.addEventListener('click', toggleSample)
      })
}

function toggleSample(){
    let id = this.getAttribute('data-itemid');
    if(!sampids.includes(id)){
        sampids.push(id);
    }
    else{
        let index = sampids.indexOf(id);
        sampids.splice(index, 1);
    }
    let tr = this.parentNode.parentNode;
    tr.classList.toggle('alert-secondary');

    document.getElementById('selected-samples').value = JSON.stringify(sampids);

    if(sampids.length==0){
        document.getElementById('clear-samples').disabled = true;
    }
    else{
        document.getElementById('clear-samples').disabled = false;
    }

    console.log(sampids);
}


