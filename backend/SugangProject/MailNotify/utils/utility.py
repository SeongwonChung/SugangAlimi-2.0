# for relative import
import os, sys
import django
import asyncio
from collections import deque
import time

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
import datetime

# # for test
# from MailNotify.utils.course_info_for_test import course_info_for_test

USER_ID = "put your id here"
USER_PW = "put your pw here"

ko_times = [
    # 수강신청기간 시작 ~ 시작 후 30분, 마감 1시간 전 ~ 마감 시간(kr)
    # (datetime.datetime(2021, 2, 16, 10, 0), datetime.datetime(2021, 2, 16, 10, 30)),
    # (datetime.datetime(2021, 2, 17, 8, 0), datetime.datetime(2021, 2, 17, 9, 0)),
    # (datetime.datetime(2021, 2, 17, 10, 0), datetime.datetime(2021, 2, 17, 10, 30)),
    # (datetime.datetime(2021, 2, 18, 8, 0), datetime.datetime(2021, 2, 18, 9, 0)),
    # (datetime.datetime(2021, 2, 18, 10, 0), datetime.datetime(2021, 2, 18, 10, 30)),
    # (datetime.datetime(2021, 2, 19, 8, 0), datetime.datetime(2021, 2, 19, 9, 0)),
    # (datetime.datetime(2021, 2, 19, 10, 0), datetime.datetime(2021, 2, 19, 10, 30)),
    # (datetime.datetime(2021, 2, 20, 8, 0), datetime.datetime(2021, 2, 20, 9, 0)),
    (datetime.datetime(2021, 3, 5, 18, 0), datetime.datetime(2021, 3, 5, 19, 0)),
    (datetime.datetime(2021, 3, 6, 11, 0), datetime.datetime(2021, 3, 6, 12, 0)),
]


def get_courses_to_crawl():
    notified_users = set()
    for profile in Profile.objects.filter(notification=True).select_related("user"):
        # 알림킨 user들
        notified_users.add(profile.user)

    courses = set()
    for wish in Wish.objects.select_related("user"):
        if wish.user in notified_users:
            courses.add(wish.course)

    return courses


def make_class_list(courses):
    # courses는 model object list
    class_list = []
    for course in courses:
        class_info = {
            "course_id": course.pk,
            "course_num": course.course_num,
            "class_num": course.class_num,
        }
        class_list.append(class_info)
    return class_list


## crawl
def crawl_login(user_id, user_pw):
    # 10개씩 청크한 과목 크롤링시 로그인 횟수 제한 피하기 위해 따로 로그인
    JSESSIONID = login(user_id, user_pw)
    return JSESSIONID


def crawl_regi(class_list, JSESSIONID):
    # 10개씩 청크한 과목 크롤링시 로그인 횟수 제한 피하기 위해 JSESSIONID 재활용
    print(class_list)
    crawled_data = registrations(class_list, JSESSIONID)
    return crawled_data


def crawl_test(class_list, user_id, user_pw):
    JSESSIONID = login(user_id, user_pw)

    crawled_data = registrations(class_list, JSESSIONID)
    return crawled_data


def get_courses_to_notify(crawler_data, isProd=False):
    courses_to_notify = []
    for course_info in crawler_data:
        if course_info["status"]["capacity"] == False:
            # 정원없는 경우 알림과목에서 제외.
            continue

        if check_registration(course_info, isProd):
            courses_to_notify.append(course_info["course_id"])
    return courses_to_notify


def get_course_user_dict(courses_to_notify):
    course_user_dict = defaultdict(list)
    for course_id in courses_to_notify:
        course_user_dict[course_id] = [
            wish.user.email
            for wish in Wish.objects.filter(course=course_id).select_related("user")
        ]
    return course_user_dict


def mail(course_user_dict):
    for course_id in course_user_dict.keys():
        course = Course.objects.get(pk=course_id)
        mailing_list = course_user_dict[course_id]

        now = datetime.datetime.now()
        nowDatetime = now.strftime("%Y-%m-%d %H:%M:%S")
        mail_title = "[수강신청알리미 ⏰] 즐겨찾기한 과목에 자리가 났어요! 😎"
        message = f"즐겨찾기 하신 과목 {course.course_num}-{course.class_num}, {course.title}에 자리가 났습니다! 수강신청 사이트에서 신청하세요. \n해당 메일 발신 시간은 {nowDatetime}입니다. 메일 수신시 회신해주시면 서비스 질 향상에 도움이 됩니다. 감사합니다. [수강신청알리미 드림]"
        send_email(
            mail_title,
            message,
            from_email=None,
            recipient_list=mailing_list,
        )


# DONE: registrations.py에 분반도 들어가도록 혹은 DB의 COURSE table id 포함하도록 수정,
# DONE: 받아온 결과 Registration table에 있는지 검사해서 저장 or 비교
# DONE: 후에 ==> 알림메일 전송
# DONE:multiprocessing 모듈 사용해서 빠르게 돌아가는 크롤러 로직 만들기
# DONE: django-crontab 사용해서 주기적으로 반복되도록, 하나의 인스턴스에서만 동작하도록 setting.


### JOBS


def mail_notify():

    # 알림여부 확인할 과목 가져오기
    courses = get_courses_to_crawl()
    print("확인할 과목 갯수: ", len(courses))

    # 크롤링 모듈에 맞게 과목정보 정리
    class_list = make_class_list(courses)

    chunked = [
        class_list[i : i + 10] for i in range(0, len(class_list), 10)
    ]  # 10개씩 잘라서 넣기
    chunked = deque(chunked)
    # 크롤링
    JSESSIONID = crawl_login(USER_ID, USER_PW)

    retry_cnt = 0
    while len(chunked) > 0:
        class_list = chunked.popleft()
        try:
            crawled_data = crawl_regi(class_list, JSESSIONID)
        except Exception as e:
            print("error: ", e)
            if retry_cnt >= 10:
                print(f"버리는과목: {len(class_list)}", class_list)
                retry_cnt = 0
            else:
                print(f"chunk retry{retry_cnt}!")
                chunked.append(class_list)
                retry_cnt += 1
                continue
        else:
            retry_cnt = 0  # 성공시 Retry count 초기화
        print(f"크롤링 결과: {len(crawled_data)}과목 성공")
        # time.sleep(1)  # 1초 쉬어주고(없애면 더 빠름)
        # print(crawled_data)

        # 크롤링 데이터에서 알림 보낼 과목의 id가져오기
        courses_to_notify = get_courses_to_notify(crawled_data, isProd=True)
        print(f"알림대상과목: {len(courses_to_notify)}과목")
        print(courses_to_notify)

        # 알림보낼 과목에 대해 즐겨찾기한 유저 목록 가져오기
        course_user_dict = get_course_user_dict(courses_to_notify)
        print("알림대상 과목별 유저 메일 data")
        print(course_user_dict)
        # 시간체크
        if not time_to_mail(ko_times):
            return
        # 메일 전송
        mail(course_user_dict)


## local version
def mail_notify_local():

    # 알림여부 확인할 과목 가져오기
    courses = get_courses_to_crawl()
    print("확인할 과목 갯수: ", len(courses))

    # 크롤링 모듈에 맞게 과목정보 정리
    class_list = make_class_list(courses)

    chunked = [
        class_list[i : i + 10] for i in range(0, len(class_list), 10)
    ]  # 10개씩 잘라서 넣기
    chunked = deque(chunked)
    # 크롤링
    JSESSIONID = crawl_login(USER_ID, USER_PW)

    retry_cnt = 0
    while len(chunked) > 0:
        class_list = chunked.popleft()
        try:
            crawled_data = crawl_regi(class_list, JSESSIONID)
        except Exception as e:
            print("error: ", e)
            if retry_cnt >= 10:
                print(f"버리는과목: {len(class_list)}", class_list)
                retry_cnt = 0
            else:
                print(f"chunk retry{retry_cnt}!")
                chunked.append(class_list)
                retry_cnt += 1
                continue
        else:
            retry_cnt = 0  # 성공시 Retry count 초기화
        print(f"크롤링 결과: {len(crawled_data)}과목 성공")
        # time.sleep(1)  # 1초 쉬어주고(없애면 더 빠름)

        # 크롤링 데이터에서 알림 보낼 과목의 id가져오기
        courses_to_notify = get_courses_to_notify(crawled_data)
        print(f"알림대상과목: {len(courses_to_notify)}과목")
        print(courses_to_notify)

        # 알림보낼 과목에 대해 즐겨찾기한 유저 목록 가져오기
        course_user_dict = get_course_user_dict(courses_to_notify)
        print("알림대상 과목별 유저 메일 data")
        print(course_user_dict)

        # 시간체크 & 메일 전송
        if time_to_mail_local(ko_times):
            mail(course_user_dict)
