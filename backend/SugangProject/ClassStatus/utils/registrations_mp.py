import time
import json
import requests
from bs4 import BeautifulSoup
import multiprocessing as mp


def get_data(class_info, cookies, headers, params):

    data = {
        "year": "2021",
        "term": "1R",
        "cour_cd": class_info["course_num"],
        "cour_cls": class_info["class_num"],
    }

    response = requests.post(
        "http://sugang.korea.ac.kr/sugang",
        cookies=cookies,
        headers=headers,
        params=params,
        data=data,
        verify=False,
    )

    soup = BeautifulSoup(response.text, "html.parser")
    tr_data = soup.select("tbody.th-center.td-center > tr")
    result_data = []

    for tr in tr_data:
        grade = tr.select_one("th").text
        apply = tr.select("td")[0].text
        limit = tr.select("td")[1].text

        result_data_schema = {"grade": grade, "apply": apply, "limit": limit}
        result_data.append(result_data_schema)
    result = {
        "course": class_info["course_num"],
        "status": result_data,
    }
    return result


def registrations_mp(class_list, JSESSIONID):

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

    pool = mp.Pool(mp.cpu_count())

    final_data = [
        pool.apply_async(
            get_data,
            (
                class_info,
                cookies,
                headers,
                params,
            ),
        )
        for class_info in class_list
    ]
    pool.close()
    pool.join()
    final_data = [data.get() for data in final_data]

    return final_data
