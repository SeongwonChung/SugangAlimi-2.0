# for relative import
import os, sys
import django

sys.path.append(
    os.path.dirname(
        os.path.abspath(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
    )
)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "SugangProject.settings")

django.setup()
from MailNotify.models import Registration
from ClassStatus.models import Course
from django.utils import timezone
import datetime
from MailNotify.utils.time_to_mail import *

grade_time = [
    (datetime.datetime(2021, 2, 16, 10, 0), datetime.datetime(2021, 2, 17, 9, 0)),
    (datetime.datetime(2021, 2, 17, 10, 0), datetime.datetime(2021, 2, 18, 9, 0)),
    (datetime.datetime(2021, 2, 18, 10, 0), datetime.datetime(2021, 2, 19, 9, 0)),
    (datetime.datetime(2021, 2, 19, 10, 0), datetime.datetime(2021, 2, 20, 9, 0)),
]


def check_grade(grade_time, current_datetime, isProd):
    current_datetime = timezone.make_naive(current_datetime)

    if isProd:
        grade_time = convert_all_to_utc(grade_time)

    result = "total"
    if current_datetime >= grade_time[0][0] and current_datetime <= grade_time[0][1]:
        result = "4"
    elif current_datetime >= grade_time[1][0] and current_datetime <= grade_time[1][1]:
        result = "3"
    elif current_datetime >= grade_time[2][0] and current_datetime <= grade_time[2][1]:
        result = "2"
    elif current_datetime >= grade_time[3][0] and current_datetime <= grade_time[3][1]:
        result = "1"
    return result


def check_registration(course_info, isProd):  # local
    course_id = course_info["course_id"]
    status = course_info["status"]
    course_instance = Course.objects.get(pk=course_id)
    qs = Registration.objects.filter(course=course_instance)
    if not qs:
        Registration.objects.create(
            course=course_instance,
            one_apply=status["1"]["apply"],
            one_limit=status["1"]["limit"],
            two_apply=status["2"]["apply"],
            two_limit=status["2"]["limit"],
            three_apply=status["3"]["apply"],
            three_limit=status["3"]["limit"],
            four_apply=status["4"]["apply"],
            four_limit=status["4"]["limit"],
            exchange_apply=status["ex"]["apply"],
            exchange_limit=status["ex"]["limit"],
            grad_apply=status["grad"]["apply"],
            grad_limit=status["grad"]["limit"],
            total_apply=status["total"]["apply"],
            total_limit=status["total"]["limit"],
        )
        return False  # 이 과목은 메일알림 no
    else:
        registration_in_db = qs[0]
        notify = False
        grade = check_grade(grade_time, timezone.now(), isProd)
        if compare_status(
            status, registration_in_db, grade
        ):  # TODO: 학년별 수강신청 때 이 부분의 grade를 조정해서 배포 -- check_grade로 설정완료
            notify = True  # 이 과목은 메일알림 yes

        # update
        registration_in_db.one_apply = status["1"]["apply"]
        registration_in_db.one_limit = status["1"]["limit"]
        registration_in_db.two_apply = status["2"]["apply"]
        registration_in_db.two_limit = status["2"]["limit"]
        registration_in_db.three_apply = status["3"]["apply"]
        registration_in_db.three_limit = status["3"]["limit"]
        registration_in_db.four_apply = status["4"]["apply"]
        registration_in_db.four_limit = status["4"]["limit"]
        registration_in_db.exchange_apply = status["ex"]["apply"]
        registration_in_db.exchange_limit = status["ex"]["limit"]
        registration_in_db.grad_apply = status["grad"]["apply"]
        registration_in_db.grad_limit = status["grad"]["limit"]
        registration_in_db.total_apply = status["total"]["apply"]
        registration_in_db.total_limit = status["total"]["limit"]
        registration_in_db.save()

        return notify


def compare_status(status, registration_in_db, grade):
    # grade = "1","2","3","4","ex","grad","total"
    if grade == "1":
        db_apply = registration_in_db.one_apply
        db_limit = registration_in_db.one_limit
    elif grade == "2":
        db_apply = registration_in_db.two_apply
        db_limit = registration_in_db.two_limit
    elif grade == "3":
        db_apply = registration_in_db.three_apply
        db_limit = registration_in_db.three_limit
    elif grade == "4":
        db_apply = registration_in_db.four_apply
        db_limit = registration_in_db.four_limit
    elif grade == "ex":
        db_apply = registration_in_db.exchange_apply
        db_limit = registration_in_db.exchange_limit
    elif grade == "grad":
        db_apply = registration_in_db.grad_apply
        db_limit = registration_in_db.grad_limit
    elif grade == "total":
        db_apply = registration_in_db.total_apply
        db_limit = registration_in_db.total_limit

    if db_apply == None or db_limit == None:
        # 해당학년 신청인원/정원 data없는 경우, 전체 신청인원/정원으로 판별.
        grade = "total"
        db_apply = registration_in_db.total_apply
        db_limit = registration_in_db.total_limit
        if db_apply == None or db_limit == None:  # 전체 신청인원/정원 정보도 없을 경우
            return False

    if db_apply == db_limit:  # 기존 상황에 정원 다 찼을 경우
        if status[grade]["apply"] < db_limit:
            return True

    return False
