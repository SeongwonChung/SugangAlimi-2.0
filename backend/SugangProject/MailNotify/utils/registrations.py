import time
import json
import requests
from bs4 import BeautifulSoup
from MailNotify.utils.parser import *
import multiprocessing as mp


def get_data(class_info, cookies, headers, params):

    data = {
        "year": "2021",
        "term": "1R",
        "cour_cd": class_info["course_num"],
        "cour_cls": class_info["class_num"],
    }

    for attempt in range(5):  # 5번까지 연결 시도.
        try:
            response = requests.post(
                "http://sugang.korea.ac.kr/sugang",
                cookies=cookies,
                headers=headers,
                params=params,
                data=data,
                verify=False,
            )
        except requests.exceptions.ConnectionError as e:
            if attempt == 4:
                raise
            print(f'retry for {class_info["course_num"]} - {class_info["class_num"]}')
            time.sleep(1)
            continue
        else:
            break

    soup = BeautifulSoup(response.text, "html.parser")
    tr_data = soup.select("tbody.th-center.td-center > tr")

    # 정원없는 경우 예외처리
    if "정원이 설정되지않은 과목입니다." in tr_data[0].select_one("td").text:
        result = {
            "course_id": class_info["course_id"],
            "status": {"capacity": False},
        }
        return result

    result_data = dict()
    result_data["capacity"] = True  # 정원 존재여부 status dict의 capacity로 확인.

    for tr in tr_data:
        grade = handle_grade(tr.select_one("th").text)
        apply = handle_apply(tr.select("td")[0].text)
        limit = handle_limit(tr.select("td")[1].text)

        result_data[grade] = {"apply": apply, "limit": limit}

    result = {
        "course_id": class_info["course_id"],
        "status": result_data,
    }
    return result


def registrations(class_list, JSESSIONID):
    # class_list는 course_id, course_num, class_num 형태
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
    print("cpu", mp.cpu_count())

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
