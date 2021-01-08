const fs = require('fs');
const path = require('path');

window.addEventListener("DOMContentLoaded",() => {
    const divRutas = document.getElementById('rutas');
    const data = getData();
    data.forEach(ruta => divRutas.append(createDiv(createTitle(ruta.ruta),createButton(ruta.token))));
});

function getData(){
    const data = fs.readFileSync(path.join(__dirname,'rutas.json'));
    return JSON.parse(data);
}

function createDiv(...childs){
    const div = document.createElement('div');
    div.classList.add('col-12','col-md-6','form-group');
    childs.forEach(c => div.append(c));
    return div;
}

function createTitle(text){
    const title = document.createElement('p');
    title.textContent = text;
    title.classList.add('fs-3');
    return title;
}

function createButton(id){
    const button = document.createElement('button');
    button.id = id;
    button.classList.add('btn','btn-primary','btn-sm','btn-token');
    button.textContent = "Reporte";
    return button;
}