# for relative import
import os, sys
import django
import asyncio

sys.path.append(
    os.path.dirname(
        os.path.abspath(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
    )
)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "SugangProject.production")

django.setup()
from ClassStatus.models import Course, Wish
from User.models import Profile
from MailNotify.models import Registration
from django.contrib.auth.models import User
from collections import defaultdict

from MailNotify.utils.mailer import send_email
from MailNotify.utils.login import login
from MailNotify.utils.registrations import registrations
from MailNotify.utils.check_registration import *
from MailNotify.utils.time_to_mail import *
from MailNotify.utils.utility import *
import time, datetime

ko_times = [
    # 수강신청기간 시작 ~ 시작 후 30분, 마감 1시간 전 ~ 마감 시간(kr)
    (datetime.datetime(2021, 2, 16, 10, 0), datetime.datetime(2021, 2, 16, 10, 30)),
    (datetime.datetime(2021, 2, 17, 8, 0), datetime.datetime(2021, 2, 17, 9, 0)),
    (datetime.datetime(2021, 2, 17, 10, 0), datetime.datetime(2021, 2, 17, 10, 30)),
    (datetime.datetime(2021, 2, 18, 8, 0), datetime.datetime(2021, 2, 18, 9, 0)),
    (datetime.datetime(2021, 2, 18, 10, 0), datetime.datetime(2021, 2, 18, 10, 30)),
    (datetime.datetime(2021, 2, 19, 8, 0), datetime.datetime(2021, 2, 19, 9, 0)),
    (datetime.datetime(2021, 2, 19, 10, 0), datetime.datetime(2021, 2, 19, 10, 30)),
    (datetime.datetime(2021, 2, 20, 8, 0), datetime.datetime(2021, 2, 20, 9, 0)),
]


while True:
    now = datetime.datetime.now()
    nowDatetime = now.strftime("%Y-%m-%d %H:%M:%S")
    print(f"⏰현재시각: {nowDatetime} 시작")
    for attempt in range(1, 6):  # 실패시 5번까지 반복함.
        print(f"🔍{attempt}번째 시도...")
        try:
            mail_notify_local()
        except Exception as error:
            print("error: ", error)
            now = datetime.datetime.now()
            failDatetime = now.strftime("%Y-%m-%d %H:%M:%S")
            print(f"ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ{attempt}번째 실패ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ")
            print(f"⏰실패시각: {failDatetime}")
            continue
        else:
            now = datetime.datetime.now()
            nowDatetime = now.strftime("%Y-%m-%d %H:%M:%S")
            print("************이번엔 성공!**************")
            print(f"⏰종료시각: {nowDatetime}")
            break
    print("10분대기중...")
    time.sleep(600)


