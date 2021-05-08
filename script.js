document.addEventListener('DOMContentLoaded', getData);

var data = null; //сделать через замыкание

async function getJSON() {
    let result = await fetch('./api/test.js');
    return await result.json();
}

async function getData() {
    data = await getJSON();
    await console.log(data);
}