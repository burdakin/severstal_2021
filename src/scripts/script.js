/*
- Замыкания
- Выровнять таблицу
- Ахуенно накидать стилей
* - Сделать побольше джсон
*/

document.addEventListener('DOMContentLoaded', getData);
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('g-search-btn').addEventListener('click', globalSearch);
    document.getElementById('g-search').addEventListener('input', globalSearch);
    document.getElementById('launch').addEventListener('click', filters);
    document.getElementById('reset').addEventListener('click', reset);
});

// var data = null; //сделать через замыкание
var filterArray = []; //сделать через замыкание

async function getJSON() {
    let result = await fetch('./src/api/data.json');
    return await result.json();
}

class Data {
    constructor () {
        this.data = data;
    }
    async function getData() {
        this.data = getJSON
    }
}

async function data() {
    let data = '';
    return function returnData() {
        data = obj;
        return data;
    }
}

async function getData() {
    let obj = await getJSON();
    let dataClosure = await data(obj);
    await console.log(dataClosure());
    await renderTable(dataClosure());
}

function renderTable(array) {
    clearTable();
    let length = Object.keys(array).length;
    let table = document.createElement('table');
    table.setAttribute('id', 'table');
    table.setAttribute('class', 'table');
    table.innerHTML = '<tr><th>№ Заявки</th><th>Приоритет</th><th>Статус заявки</th><th>№ СЗ</th><th>Дата создания</th><th>Дата завершения</th><th>Исполнитель</th></tr>'
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

function getArray() {
    filterArray = [];
    for (let key in data) {
        filterArray.push(data[key])
    }
};


function globalSearch() {
    let result = [];
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

function selectSearch(id, val) {
    if (document.getElementById(id).value !== 'null') {
        let tempArr = []
        let value = document.getElementById(id).value;
        for (let key in filterArray) {
            if (value == filterArray[key][val]) {
                tempArr.push(data[key]);
            }
        }
        filterArray = tempArr;
    }
}

function getDate() {
    let st = Date.parse(document.getElementById('start').value);
    let fin = Date.parse(document.getElementById('fin').value);

    if ((Number.isNaN(st) == false) && (Number.isNaN(fin) == false)) {
        let tempArr = [];
        for (let key in filterArray) {
            let startDate = Date.parse(filterArray[key].start);
            let finDate = Date.parse(filterArray[key].finish);
            if ((st <= startDate) && (fin >= finDate)) {
                tempArr.push(filterArray[key])
            }
        }
        filterArray = tempArr;
    } else if (Number.isNaN(st) == true) {
        let tempArr = [];
        for (let key in filterArray) {
            let finDate = Date.parse(filterArray[key].finish);
            if (fin >= finDate) {
                tempArr.push(filterArray[key])
            }
        }
    } else if (Number.isNaN(fin) == true) {
        let tempArr = [];
        for (let key in filterArray) {
            let startDate = Date.parse(filterArray[key].start);
            if (st >= startDate) {
                tempArr.push(filterArray[key])
            }
        }
    }
}

function reset() {
    document.getElementById('order-num-text').value = '';
    document.getElementById('priority-select').value = 'null';
    document.getElementById('status-select').value = 'null';
    document.getElementById('start').value = '';
    document.getElementById('fin').value = '';
    renderTable(data());

}

function filters() {
    filterArray = [];
    clearTable();
    orderSearch();
    selectSearch('priority-select', 'priority');
    selectSearch('status-select', 'status');
    getDate();
    renderTable(filterArray);
}