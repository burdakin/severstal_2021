/*
- Шрифты, адаптивчик
- раскидать скрипты и стили и настроить Галп
* - Сделать побольше джсон
*/

document.addEventListener('DOMContentLoaded', getData);
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('g-search-btn').addEventListener('click', globalSearch);
    document.getElementById('g-search').addEventListener('input', globalSearch);
    document.getElementById('launch').addEventListener('click', filters);
    document.getElementById('reset').addEventListener('click', reset);
});

class Arrays {
    constructor() {
        this.data = '';
        this.filterArr = [];
    }

    async get() {
        this.data = await getJSON();
        return this.data;
    }
}

var arrs = new Arrays();

async function getData() {
    let data = await arrs.get();
    await renderTable(data);
}

async function getJSON() {
    let result = await fetch('./src/api/data.json');
    return await result.json();
}

function renderTable(array) {
    clearTable();
    let length = Object.keys(array).length;
    let table = document.createElement('table');
    table.setAttribute('id', 'table');
    table.setAttribute('class', 'table');
    table.innerHTML = '<tr class="t-header"><th>№ Заявки</th><th>Приоритет</th><th>Статус заявки</th><th>№ СЗ</th><th>Дата создания</th><th>Дата завершения</th><th>Исполнитель</th></tr>'
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
    arrs.filterArr = [];
    for (let key in arrs.data) {
        arrs.filterArr.push(arrs.data[key])
    }
};


function globalSearch() {
    let result = [];
    let input = document.getElementById('g-search').value.toLowerCase()
    for (let key in arrs.data) {
        let str = JSON.stringify(arrs.data[key]).toLowerCase();
        if (str.match(input) !== null) {
            result.push(arrs.data[key]);
        }
    }
    renderTable(result);
}

function orderSearch() {
    let order = document.getElementById('order-num-text').value.toLowerCase();
    if (order !== '') {
        for (let key in arrs.data) {
            let str = JSON.stringify(arrs.data[key].id).toLowerCase();
            if (str.match(order) !== null) {
                arrs.filterArr.push(arrs.data[key]);
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
        for (let key in arrs.filterArr) {
            if (value == arrs.filterArr[key][val]) {
                tempArr.push(arrs.data[key]);
            }
        }
        arrs.filterArr = tempArr;
    }
}

function getDate() {
    let st = Date.parse(document.getElementById('start').value);
    let fin = Date.parse(document.getElementById('fin').value);

    if ((Number.isNaN(st) == false) && (Number.isNaN(fin) == false)) {
        let tempArr = [];
        for (let key in arrs.filterArr) {
            let startDate = Date.parse(arrs.filterArr[key].start);
            let finDate = Date.parse(arrs.filterArr[key].finish);
            if ((st <= startDate) && (fin >= finDate)) {
                tempArr.push(arrs.filterArr[key])
            }
        }
        arrs.filterArr = tempArr;
    } else if (Number.isNaN(st) == true) {
        let tempArr = [];
        for (let key in arrs.filterArr) {
            let finDate = Date.parse(arrs.filterArr[key].finish);
            if (fin >= finDate) {
                tempArr.push(arrs.filterArr[key])
            }
        }
    } else if (Number.isNaN(fin) == true) {
        let tempArr = [];
        for (let key in arrs.filterArr) {
            let startDate = Date.parse(arrs.filterArr[key].start);
            if (st >= startDate) {
                tempArr.push(arrs.filterArr[key])
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
    renderTable(arrs.data);

}

function filters() {
    arrs.filterArr = [];
    clearTable();
    orderSearch();
    selectSearch('priority-select', 'priority');
    selectSearch('status-select', 'status');
    getDate();
    renderTable(arrs.filterArr);
}