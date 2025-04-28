async function fetchScores() {
    const response = await fetch('data/score.json');
    const data = await response.json();
    return data;
}

function scrollToTarget(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
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

    const milestones = {
        1: { id: 'jump-day1-prelim', label: '📅 Day-1 預賽' },
        20: { id: 'jump-day1-final', label: '📅 Day-1 決賽' },
        39: { id: 'jump-day2-prelim', label: '📅 Day-2 預賽' },
        56: { id: 'jump-day2-final', label: '📅 Day-2 決賽' },
        75: { id: 'jump-day3-prelim', label: '📅 Day-3 預賽' },
        91: { id: 'jump-day3-final', label: '📅 Day-3 決賽' },
        109: { id: 'jump-day4-prelim', label: '📅 Day-4 預賽' },
        128: { id: 'jump-day4-final', label: '📅 Day-4 決賽' },
        147: { id: 'jump-day5-prelim', label: '📅 Day-5 預賽' },
        158: { id: 'jump-day5-final', label: '📅 Day-5 決賽' },
        201: { id: 'jump-timed-final', label: '📅 計時決賽' },
    };

    data.sort((a, b) => a.order - b.order);

    data.forEach(event => {
        // 插入分隔標題
        if (milestones[event.order]) {
            const divider = document.createElement('div');
            divider.className = 'milestone';
            divider.id = milestones[event.order].id;
            divider.textContent = milestones[event.order].label;
            container.appendChild(divider);
        }

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
