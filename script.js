async function fetchScores() {
    const response = await fetch('data/score.json');
    const data = await response.json();
    return data;
}

function createTable(scores) {
    const table = document.createElement('table');
    table.className = 'score-table';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = Object.keys(scores[0]);
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    scores.forEach(score => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = score[header];
            // 如果有晉級(q01, q02...)，加上 highlight
            if (header.includes('晉級') && score[header] && score[header].toLowerCase().startsWith('q')) {
                td.className = 'highlight';
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    return table;
}

function renderScores(data) {
    const container = document.getElementById('scoreContainer');
    container.innerHTML = '';

    // 按 order 排序
    data.sort((a, b) => a.order - b.order);

    data.forEach(event => {
        const section = document.createElement('div');
        section.className = 'event-section';

        const header = document.createElement('div');
        header.className = 'event-header';
        header.textContent = `${event.order}. ${event.title}`;
        section.appendChild(header);

        const table = createTable(event.scores);
        table.style.display = 'none';
        section.appendChild(table);

        header.addEventListener('click', () => {
            table.style.display = (table.style.display === 'none') ? 'table' : 'none';
        });

        container.appendChild(section);
    });

    document.getElementById('loading').style.display = 'none';
    container.style.display = 'block';

    document.getElementById('searchInput').addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('.score-table tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchValue) ? '' : 'none';
        });
    });

    // 更新時間
    if (data.length > 0) {
        const updateTime = new Date(data[0].timestamp);
        document.getElementById('updateTime').textContent = `資料更新於：${updateTime.toLocaleString('zh-TW')}`;
    }
}

fetchScores().then(renderScores);
