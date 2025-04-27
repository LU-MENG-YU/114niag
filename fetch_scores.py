import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

# ===== 手動設定 =====
id_list = [
    (1, 189, "一般女生組100公尺自由式 預賽"),
    (2, 149, "一般男生組50公尺蛙式 預賽"),
    (3, 111, "一般女生組50公尺背式 預賽"),
]
# ====================

def fetch_score(id_):
    url = f"https://114niag.cjcu.edu.tw/Public/Race/Report_Score.aspx?id={id_}"
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
    except requests.RequestException:
        return None

    soup = BeautifulSoup(res.text, 'html.parser')
    table = soup.find('table', id='table1')
    if not table:
        return None

    rows = []
    for tr in table.find_all('tr'):
        cols = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
        if cols:
            rows.append(cols)

    if len(rows) < 2:
        return None

    headers = rows[0]
    data_rows = rows[1:]

    records = []
    for row in data_rows:
        if len(row) >= len(headers):
            record = dict(zip(headers, row))
            records.append(record)

    return records


def main():
    result = []
    for order, id_, title in id_list:
        scores = fetch_score(id_)
        if scores:
            result.append({
                "order": order,
                "id": id_,
                "title": title,
                "timestamp": datetime.now().isoformat(),
                "scores": scores
            })

    with open('data/score.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
