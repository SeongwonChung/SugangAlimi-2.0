# for relative import
import os, sys
import django

sys.path.append(
    os.path.dirname(
        os.path.abspath(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
    )
)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "SugangProject.production")

django.setup()

from django.utils import timezone
import datetime


def convert_to_utc(ko_datetime):
    return ko_datetime - datetime.timedelta(hours=9)


def convert_all_to_utc(ko_times):
    utc_times = []
    for start, end in ko_times:
        utc_times.append((convert_to_utc(start), convert_to_utc(end)))
    return utc_times


def time_to_mail(ko_times):
    utc_times = convert_all_to_utc(ko_times)

    current = timezone.make_naive(timezone.now())
    result = True
    for start, end in utc_times:
        if current >= start and current <= end:
            print("not time to mail")
            result = False
    return result


def time_to_mail_local(ko_times):
    current = timezone.make_naive(timezone.now())
    result = True
    for start, end in ko_times:
        if current >= start and current <= end:
            print("not time to mail")
            result = False
    return result