from django.urls import path

from . import views

app_name = "User"

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("activate/<str:user_id>/<str:token>/", views.activate, name="activate"), 
    path("withdraw/", views.withdraw, name="withdraw"),
    path("mypage/", views.mypage, name="mypage"),
]
