import time
import json
import requests


def login(user_id, user_pw):

    t = time.time() / 1000.0
    t = str(t).replace(".", "")[:13]

    login_headers = {
        "Connection": "keep-alive",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
        "Accept": "*/*",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Dest": "script",
        "Referer": "http://sugang.korea.ac.kr/login?attribute=login",
        "Accept-Language": "en-US,en;q=0.9",
    }

    login_params = (
        ("attribute", "loginChk"),
        ("fake", t),
        ("callback", "jQuery112405680799630617828_1597720872239"),
        ("lang", "KOR"),
        ("id", user_id),
        ("pwd", user_pw),
        ("_", t),
    )

    response = requests.get(
        "https://sugang.korea.ac.kr/login", headers=login_headers, params=login_params
    )

    JSESSIONID = response.cookies["JSESSIONID"]

    result = json.loads(response.text[response.text.find('{"msg"') : -2])

    if result["code"] != "200":
        print("로그인에 실패하였습니다. 학번과 비밀번호를 확인해주세요")
        JSESSIONID = "INVALID"
        # exit()
    else:
        print("로그인 성공 !")

    return JSESSIONID
