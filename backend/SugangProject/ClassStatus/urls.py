from django.urls import path

from . import views

app_name = "ClassStatus"

urlpatterns = [
    path("", views.home, name="home"),
    path("main/", views.main, name="main"),
    path("search/", views.search, name="search"),
    path("result/", views.result, name="result"),
    # 즐겨찾기
    path("alarmCheck/", views.alarmCheck, name="alarmCheck"),
    
    path("wish/", views.wish, name="wish"),
    path("wishCheck/", views.wishCheck, name="wishCheck"),
    path("wishlist/", views.wishlist, name="wishlist"),
    path("status/", views.status, name="status"),
]
