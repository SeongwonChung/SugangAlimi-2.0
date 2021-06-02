from django.shortcuts import render, redirect
from .utils.login import login
from .utils.registrations import registrations
from .utils.registrations_mp import registrations_mp
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .models import Course, Wish
from User.models import Profile

from django.db.models import Q
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from User.models import Profile

# Create your views here.

USER_ID = "put your user id here"
USER_PW = "put your password in here."


def home(request):
    # server on 확인용
    return render(request, "home.html")


def result(request):

    if request.method == "POST":
        # 하드코딩 해두면 될듯
        user_id = request.POST["user_id"]
        user_pw = request.POST["user_pw"]

        # 수강신청 페이지 로그인
        JSESSION_ID = login(user_id, user_pw)

        class_list = []

        for u in user:
            if u["id"] == user_id:
                class_list = u["class"]

        result = registrations(class_list, JSESSION_ID)

        context = {"result": result}

        return render(request, "ClassStatus/result.html", context)


# 즐겨찾기
@csrf_exempt
def alarmCheck(request):
    token = request.POST["token"]
    print(token)
    if token == None:
        return HttpResponse("잘못된 요청 입니다.")

    target_profile = Profile.objects.get(token=token)

    target_profile.notification = not target_profile.notification
    target_profile.save()

    response = {"notification": target_profile.notification}

    return HttpResponse(json.dumps(response))


# 즐겨찾기 추가/삭제
# @login_required(login_url="user/login/")
@csrf_exempt
def wish(request):
    if request.method == "POST":

        course_num = request.POST["course_num"]
        class_num = request.POST["class_num"]

    # auth user
    token = request.POST["token"]

    if token == None:
        return HttpResponse("잘못된 요청입니다.")

    target_profile = Profile.objects.filter(token=token)

    if len(target_profile) <= 0:
        return HttpResponse(json.dumps({"error": "invalid token"}))

    auth_user = target_profile[0].user

    wishlist = Wish.objects.filter(user=auth_user)

    course_to_wish = Course.objects.get(course_num=course_num, class_num=class_num)

    existing_wish = Wish.objects.filter(user=auth_user, course=course_to_wish)

    if existing_wish.count() > 0:
        existing_wish.delete()
        existNow = 0
    else:
        # 즐겨찾기 3개까지만 가능하도록 설정
        if len(wishlist) < 3:
            Wish.objects.create(user=auth_user, course=course_to_wish)
            existNow = 1
        # 즐겨찾기에 이미 3개 이상 등록되어 있는 경우
        else:
            existNow = 2

    # if 해당과목 현재 wish상태이면 existNow = 1
    response = {"exist": existNow}

    return HttpResponse(json.dumps(response))


# 즐겨찾기 되어있는 과목인지 체크
@csrf_exempt
def wishCheck(request):

    if request.method == "POST":

        course_num = request.POST["course_num"]
        class_num = request.POST["class_num"]

        # auth user
        token = request.POST["token"]

        if token == None:
            return HttpResponse("잘못된 요청입니다.")

        target_profile = Profile.objects.filter(token=token)
        if len(target_profile) <= 0:
            return HttpResponse(json.dumps({"error": "invalid token"}))

        auth_user = target_profile[0].user

        course_to_wish = Course.objects.get(course_num=course_num, class_num=class_num)

        existing_wish = Wish.objects.filter(user=auth_user, course=course_to_wish)

        if existing_wish.count() > 0:
            existNow = 1
        else:
            existNow = 0

        # if 해당과목 현재 wish상태이면 existNow = 1
        response = {"wished": existNow}

        return HttpResponse(json.dumps(response))


# 현재 로그인된 유저가 즐겨찾기한 모든 과목과 마감현황 반환
# @login_required(login_url="user/login/")
@csrf_exempt
def wishlist(request):
    token = request.POST["token"]
    print(token)
    if token == None:
        return HttpResponse("잘못된 요청 입니다.")

    target_profile = Profile.objects.get(token=token)
    user = User.objects.get(profile=target_profile)

    wishlist = Wish.objects.filter(user=user)
    class_list = []

    for wish in wishlist:
        class_info = {
            "course_num": wish.course.course_num,
            "class_num": wish.course.class_num,
            "title": wish.course.title,
            "prof_name": wish.course.prof_name,
        }
        class_list.append(class_info)

    # TODO: 나중에는 cookie에서 jsession_id 가져오기?
    JSESSION_ID = login(USER_ID, USER_PW)

    if JSESSION_ID == "INVALID":  # 수강신청사이트 로그인 실패
        for i in range(len(class_list)):
            class_list[i]["status"] = []

        response = {"loginInvalid": "True", "wishList": class_list}
    else:
        result = registrations_mp(class_list, JSESSION_ID)

        for i in range(len(class_list)):
            class_list[i]["status"] = result[i]["status"]

        response = {"wishList": class_list, "notification": target_profile.notification}

    return HttpResponse(json.dumps(response))


# 즐겨찾기 했을 때 과목이 추가되어 보여지는 main 페이지
def main(request):
    return render(request, "ClassStatus/main.html")


# main 페이지 상단에서 검색했을 시 search 페이지로 render
@csrf_exempt
def search(request):
    if request.method == "POST":

        # query = request.GET.get("query", "")
        # 쿼리 이용해 검색
        query = (
            request.POST["query"].replace("-", "").replace("교수님", "").replace(" ", "")
        )

        if query:
            courses = Course.objects.filter(
                Q(title__icontains=query)
                | Q(course_num__icontains=query)
                | Q(prof_name__icontains=query)
            )
        else:
            courses = Course.objects.all()

        class_list = []
        for c in courses:
            class_info = {
                "course_num": c.course_num,
                "class_num": c.class_num,
                "title": c.title,
                "prof_name": c.prof_name,
            }
            class_list.append(class_info)

        context = {"query": query, "courses": class_list}

        js_context = json.dumps(context)

        return HttpResponse(js_context)


# 과목별로 마감현황보기 -- 학수번호, 분반받아서 정보 return
@csrf_exempt
def status(request):
    if request.method == "POST":

        course_num = request.POST["course_num"]
        class_num = request.POST["class_num"]

        class_info = {"course_num": course_num, "class_num": class_num}

        class_list = [class_info]

        JSESSION_ID = login(USER_ID, USER_PW)

        result = registrations(class_list, JSESSION_ID)

        status = result[0]["status"]

        response = {"status": status}

        return HttpResponse(json.dumps(response))
