from django.core.management.base import BaseCommand, CommandError
import os, sys
import django

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
from MailNotify.utils.utility import *
import asyncio


class Command(BaseCommand):
    help = "mail_notification for user's wishlist"

    def handle(self, *args, **options):
        mail_notify()

        self.stdout.write("Mail notify Success!")
