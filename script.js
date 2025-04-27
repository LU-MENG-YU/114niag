async function fetchScores() {
    const response = await fetch('data/score.json');
    const data = await response.json();
    return data;
}

function createTable(scores) {
    const table = document.createElement('table');
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

    data.sort((a, b) => a.order - b.order);

    data.forEach(event => {
        const section = document.createElement('div');
        section.className = 'event-section';

        const title = document.createElement('h2');
        title.textContent = `${event.order}. ${event.title}`;
        title.className = 'event-title';
        section.appendChild(title);

        const table = createTable(event.scores);
        table.className = 'score-table';
        section.appendChild(table);

        container.appendChild(section);
    });

    document.getElementById('searchInput').addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('.score-table tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

fetchScores().then(renderScores);
