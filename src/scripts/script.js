document.addEventListener('DOMContentLoaded', getData);
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('g-search-btn').addEventListener('click', globalSearch);
    document.getElementById('g-search').addEventListener('input', globalSearch);
    document.getElementById('launch').addEventListener('click', filters);
});

var data = null; //сделать через замыкание
var result = []; //сделать через замыкание
var filterArray = []; //сделать через замыкание

async function getJSON() {
    let result = await fetch('./src/api/data.json');
    return await result.json();
}

async function getData() {
    data = await getJSON();
    await console.log(data);
    renderTable(data);
}

function renderTable(array) {
    clearTable();
    let length = Object.keys(array).length;
    let table = document.createElement('table');
    table.setAttribute('id', 'table');
    table.setAttribute('class', 'table');
    document.getElementById('results').appendChild(table);
    for (let i = 0; i < length; i++) {
        let row = document.createElement('tr');
        row.setAttribute('class', 'row');
        row.setAttribute('id', `row-${i}`);
        table.appendChild(row);
        let idNum = document.createElement('td');
        idNum.setAttribute('dataset-td', `id-${i}`);
        idNum.innerHTML = array[i].id;
        row.appendChild(idNum);
        let prior = document.createElement('td');
        prior.setAttribute('dataset-td', `pr-${i}`);
        prior.innerHTML = array[i].priority;
        row.appendChild(prior);
        let stat = document.createElement('td');
        stat.setAttribute('dataset-td', `st-${i}`);
        stat.innerHTML = array[i].status;
        row.appendChild(stat);
        let num = document.createElement('td');
        num.setAttribute('dataset-td', `num-${i}`);
        num.innerHTML = array[i].series;
        row.appendChild(num);
        let start = document.createElement('td');
        start.setAttribute('dataset-td', `start-${i}`)
        start.innerHTML = array[i].start;
        row.appendChild(start);
        let fin = document.createElement('td');
        fin.setAttribute('dataset-td', `fin-${i}`);
        fin.innerHTML = array[i].finish;
        row.appendChild(fin);
        let by = document.createElement('td');
        by.setAttribute('dataset-td', `by-${i}`);
        by.innerHTML = array[i].by;
        row.appendChild(by);
        document.getElementById('results').appendChild(table);
    }
}

function clearTable() {
    if (document.getElementById('table') !== null) {
        document.getElementById('table').remove();
    }
}

function globalSearch() {
    result = [];
    let input = document.getElementById('g-search').value.toLowerCase()
    for (let key in data) {
        let str = JSON.stringify(data[key]).toLowerCase();
        if (str.match(input) !== null) {
            result.push(data[key]);
        }
    }
    renderTable(result);
}

function orderSearch() {
    let order = document.getElementById('order-num-text').value.toLowerCase();
    if (order !== '') {
        for (let key in data) {
            let str = JSON.stringify(data[key].id).toLowerCase();
            if (str.match(order) !== null) {
                filterArray.push(data[key]);
            }
        }
    } else {
        getArray()
    }
}

function priorSearch() {
    if (document.getElementById('priority-select').value !== 'null') {
        let tempArr = []
        let value = document.getElementById('priority-select').value;
        for (let key in filterArray) {
            if (value == filterArray[key].priority) {
                tempArr.push(data[key]);
            }
        }
        filterArray = tempArr;
    }
}

function statSearch() {
    if (document.getElementById('status-select').value !== 'null') {
        let tempArr = []
        let value = document.getElementById('priority-select').value;
        for (let key in filterArray) {
            if (value == filterArray[key].status) {
                tempArr.push(data[key]);
            }
        }
        filterArray = tempArr;
    }
}

function selectSearch (id, value) {
     if (document.getElementById(id).value !== 'null') {
        let tempArr = []
        let value = document.getElementById(id).value;
        for (let key in filterArray) {
            if (value == filterArray[key][value]) {
                tempArr.push(data[key]);
            }
        }
        filterArray = tempArr;
    }
}

function getArray() {
        filterArray = [];
    for (let key in data) {
        filterArray.push(data[key])
    }
};

function filters() {
    filterArray = [];
    clearTable();
    selectSearch('priority-select','priority');
    selectSearch('status-select','status');
    renderTable(filterArray);
}