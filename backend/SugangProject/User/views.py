from django.shortcuts import render, redirect
from .models import Profile
from django.contrib.auth.models import User
from django.contrib import auth
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

import json
import jwt
from .my_settings import SECRET_KEY, ALGORITHM

from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from .utils.email import send_email
import re


ERROR_MSG = {
    "ID_EXIST": "이미 사용 중인 아이디 입니다.",
    "ID_NOT_EXIST": "존재하지 않는 아이디 입니다.",
    "ID_PW_MISSING": "아이디와 비밀번호를 입력해주세요.",
    "PW_CHECK": "비밀번호가 일치하지 않습니다.",
    "EMAIL_CHECK": "이메일 양식을 확인해주세요.",
    "EMAIL_APPROV": "이메일 활성화를 기다려 주세요.",
    "EMAIL_EXIST": "이미 사용 중인 이메일 입니다.",
}

# Create your views here.


@csrf_exempt
def signup(request):

    print("🥜", request.POST)

    context = {"error": {"state": False, "msg": ""}, "user": {}}

    if request.method == "POST":

        user_id = request.POST.get("user_id")
        user_email = request.POST.get("user_email")
        user_email_korea = user_email + "@korea.ac.kr"
        user_pw = request.POST.get("user_pw")
        user_pw_check = request.POST.get("user_pw_check")

        if user_id and user_email and user_pw and user_pw_check:

            user = User.objects.filter(username=user_id)

            check_email_user = User.objects.filter(email=user_email_korea)

            if len(user) == 0:

                if len(check_email_user) == 0:
                    # 이메일 중복체크

                    # 이메일 양식 확인
                    if re.search("@", user_email):

                        context["error"]["state"] = True
                        context["error"]["msg"] = ERROR_MSG["EMAIL_CHECK"]

                    else:

                        if user_pw == user_pw_check:

                            data = {"user_id": user_id}
                            token = jwt.encode(data, SECRET_KEY, ALGORITHM)
                            token_str = token.decode("utf-8")
                            context["user"]["token"] = token_str

                            created_user = User.objects.create_user(
                                username=user_id,
                                email=user_email_korea,
                                password=user_pw,
                                is_active=True,  # 신입생위해 인증 open
                            )
                            Profile.objects.create(user=created_user, token=token_str)


                            # TODO: 이메일 받지 못한경우 재전송할 수 있는 버튼

                        # 비밀번호가 일치하지 않는 경우
                        else:
                            context["error"]["state"] = True
                            context["error"]["msg"] = ERROR_MSG["PW_CHECK"]

                else:
                    # 이메일이 이미 사용중인 경우
                    context["error"]["state"] = True
                    context["error"]["msg"] = ERROR_MSG["EMAIL_EXIST"]

            # 아이디가 이미 사용중인 경우
            else:
                context["error"]["state"] = True
                context["error"]["msg"] = ERROR_MSG["ID_EXIST"]

        # 인풋을 채워서 보내지 않음 (아이디와 비밀번호를 확인하세요)
        else:
            context["error"]["state"] = True
            context["error"]["msg"] = ERROR_MSG["ID_PW_MISSING"]

    js_context = json.dumps(context)

    return JsonResponse(js_context, safe=False)


@csrf_exempt
def login(request):

    context = {"error": {"state": False, "msg": ""}, "user": {}}

    if request.method == "POST":

        user_id = request.POST.get("user_id")
        user_pw = request.POST.get("user_pw")

        if user_id and user_pw:

            user = User.objects.filter(username=user_id)

            if len(user) != 0:

                global check_user
                check_user = User.objects.get(username=user_id)
                user = auth.authenticate(username=user_id, password=user_pw)

                if user != None:

                    auth.login(request, user)
                    data = {"user_id": user_id}
                    # TODO : 유저정보로 TOKEN으로 생성해서 토큰만 넘겨야할듯
                    token = jwt.encode(data, SECRET_KEY, ALGORITHM)
                    token_str = token.decode("utf-8")
                    context["user"]["token"] = token_str

                    target_profile = Profile.objects.get(user=user)

                    target_profile.token = token_str
                    target_profile.save()

                    js_context = json.dumps(context)
                    return HttpResponse(js_context, status=200)

                # 비밀번호가 다른 경우
                else:

                    # 이메일 인증을 진행하여 is_active == True인 경우
                    if check_user.is_active != False:
                        context["error"]["state"] = True
                        context["error"]["msg"] = ERROR_MSG["PW_CHECK"]

                    # 이메일 인증을 진행하지 않아 is_active == False인 경우
                    else:
                        context["error"]["state"] = True
                        context["error"]["msg"] = ERROR_MSG["EMAIL_APPROV"]

            else:
                context["error"]["state"] = True
                context["error"]["msg"] = ERROR_MSG["ID_NOT_EXIST"]

        else:
            context["error"]["state"] = True
            context["error"]["msg"] = ERROR_MSG["ID_PW_MISSING"]

    js_context = json.dumps(context)

    return HttpResponse(js_context)


@csrf_exempt
def logout(request):
    # TODO : 토큰 만료시키기
    token = request.POST.get("token")

    if token == None:
        return HttpResponse("잘못된 요청 입니다.")

    target_profile = Profile.objects.get(token=token)

    target_profile.token = ""
    target_profile.save()

    return HttpResponse("로그아웃 완료!")


def activate(request, user_id, token):
    try:
        user = User.objects.get(username=user_id)
    except (TypeError, ValueError, OverflowError):
        user = None

    if user is not None:
        user.is_active = True
        user.save()
        auth.login(request, user)

        # TODO: 배포 후 주소 바꿔야 함
        return redirect("https://ku-sugang.com")
    else:
        return HttpResponse("불편을 끼쳐드려 죄송합니다. surforku@gmail.com으로 문의 부탁드립니다.")
    return


@csrf_exempt
def withdraw(request):
    context = {"error": {"state": False, "msg": ""}, "success": False}

    token = request.POST.get("token")

    if token == None:
        return HttpResponse("잘못된 요청입니다.", status=400)

    try:
        target_profile = Profile.objects.get(token=token)
        target_user = target_profile.user

        target_user.delete()

        context["success"] = True
    except:
        context["success"] = False
        context["error"]["state"] = True
        context["error"]["msg"] = "잘못된 토큰입니다"

    js_context = json.dumps(context)

    return HttpResponse(js_context)


@csrf_exempt
def mypage(request):
    context = {"error": {"state": False, "msg": ""}, "success": False}
    token = request.POST.get("token")
    print("hi")

    if token == None:
        return HttpResponse("잘못된 요청입니다.", status=400)

    try:
        target_profile = Profile.objects.get(token=token)
        target_user = target_profile.user
        target_user_email = target_user.email
        target_user_username = target_user.username

        context["success"] = True
    except:
        context["success"] = False
        context["error"]["state"] = True
        context["error"]["msg"] = "잘못된 토큰입니다"

    context["email"] = target_user_email
    context["username"] = target_user_username
    print(context)

    js_context = json.dumps(context)

    return HttpResponse(js_context)