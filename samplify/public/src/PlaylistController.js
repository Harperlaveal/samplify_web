document.getElementById("Search").addEventListener("click",init);
function init(){
    clearAll();
    loadId();
    showTotal();
    bindEvents();  
    setupSave();
}