## csv 파일을 db에 적용하는 모듈


import csv
import os
import django
import sys

os.chdir(".")
print("Current dir=", end=""), print(os.getcwd())

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print("BASE_DIR=", end=""), print(BASE_DIR)

sys.path.append(BASE_DIR)

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE", "SugangProject.settings"
)  # 1. 여기서 프로젝트명.settings입력
django.setup()

# 위의 과정까지가 python manage.py shell을 키는 것과 비슷한 효과

from ClassStatus.models import *  # 2. App이름.models

CSV_PATH = "../sugangList_utf8.csv"  # 3. csv 파일 경로

with open(CSV_PATH, newline="", encoding="utf-8-sig") as csvfile:  # 4. newline =''
    data_reader = csv.DictReader(csvfile)

    for row in data_reader:
        row["class_num"] = row["class_num"].zfill(2)

        Course.objects.create(  # 5. class명.objects.create
            title=row["title"],
            course_num=row["course_num"],
            class_num=row["class_num"],
            prof_name=row["prof_name"],
            time_room=row["time_room"],
        )
# 현재 분반은 00,01 이 아닌 0, 1, 2, 형태임.
# 변경하려면 변경해야될듯

