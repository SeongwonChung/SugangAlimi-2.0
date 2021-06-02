import time
import json
import requests
from bs4 import BeautifulSoup


def registrations(class_list, JSESSIONID):

    cookies = {"JSESSIONID": JSESSIONID}

    t = time.time() / 1000.0
    t = str(t).replace(".", "")[:13]

    referer = "http://sugang.korea.ac.kr/core?attribute=coreMain&fake=" + t

    params = (("attribute", "viewClose"),)

    headers = {
        "Connection": "keep-alive",
        "Accept": "text/html, */*; q=0.01",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
        "Referer": referer,
        "Accept-Language": "en-US,en;q=0.9",
    }

    final_data = []

    for cla in class_list:

        data = {
            "year": "2021",
            "term": "1R",
            "cour_cd": cla["course_num"],
            "cour_cls": cla["class_num"],
        }

        response = requests.post(
            "http://sugang.korea.ac.kr/sugang",
            cookies=cookies,
            headers=headers,
            params=params,
            data=data,
            verify=False,
        )
        res_obj = response.headers
        # res_obj = json.loads(res_obj)
        # print(res_obj)
        soup = BeautifulSoup(response.text, "html.parser")
        # print(soup)
        tr_data = soup.select("tbody.th-center.td-center > tr")
        result_data = []
        
        # 정원이 설정되지 않은 과목
        if len(tr_data) == 1: 
            result_data = [
                {'grade': '1학년', 'apply': '-', 'limit': '-'}, 
                {'grade': '2학년', 'apply': '-', 'limit': '-'}, 
                {'grade': '3학년', 'apply': '-', 'limit': '-'}, 
                {'grade': '4학년', 'apply': '-', 'limit': '-'}, 
                {'grade': '교환학생', 'apply': '-', 'limit': '-'}, 
                {'grade': '대학원생', 'apply': '-', 'limit': '-'}, 
                {'grade': '전체', 'apply': '-', 'limit': '-'}]
            
        else:
            for tr in tr_data:
                grade = tr.select_one("th").text
                apply = tr.select("td")[0].text
                limit = tr.select("td")[1].text

                result_data_schema = {"grade": grade, "apply": apply, "limit": limit}
                result_data.append(result_data_schema)

        # TODO: 나중엔 학수번호가 아니라 과목명을 받아 와야할듯

        final_data.append({"course": cla["course_num"], "status": result_data})

    return final_data
