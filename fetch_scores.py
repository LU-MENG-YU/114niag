import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

id_list = [
    (1, 189, "一般女生組100公尺自由式 預賽"),
    (2, 149, "一般男生組50公尺蛙式 預賽"),
    (3, 111, "一般女生組50公尺背式 預賽"),
    (5, 209, "一般女生組100公尺蝶式 預賽"),
    (24, 208, "一般女生組100公尺蝶式 決賽"),
    (45, 185, "一般女生組100公尺自由式 預賽"),
    (62, 184, "一般女生組100公尺自由式 決賽"),
    (79, 203, "一般女生組游泳 100公尺仰式 預賽"),
    (83, 197, "一般女生組100公尺蛙式 預賽"),
    (97, 202, "一般女生組游泳 100公尺仰式 決賽"),
    (101, 196, "一般女生組100公尺蛙式 決賽"),
    (109, 193, "一般女生組1500公尺自由式 慢組計時決賽"),
    (128, 192, "一般女生組1500公尺自由式 快組計時決賽"),
    (215, , ""),
    (, , ""),
    (, , ""),
    (, , ""),
    (, , ""),
    (, , ""),
    (, , ""),
    (, , ""),
    (, , ""),
    (, , ""),
]

def fetch_score(id_):
    url = f"https://114niag.cjcu.edu.tw/Public/Race/Report_Score.aspx?id={id_}"
    print(f"Fetching {url}")
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36"
        }
        res = requests.get(url, headers=headers, timeout=10, verify=False)  # <--- 這裡加 verify=False
        print(f"Status Code: {res.status_code}")
        res.raise_for_status()
    except requests.RequestException as e:
        print(f"Request error: {e}")
        return None

    soup = BeautifulSoup(res.text, 'html.parser')
    table = soup.find('table', id='table1')
    if not table:
        print("No table found.")
        return None

    rows = []
    for tr in table.find_all('tr'):
        cols = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
        if cols:
            rows.append(cols)

    if len(rows) < 2:
        print("Table has no data rows.")
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
