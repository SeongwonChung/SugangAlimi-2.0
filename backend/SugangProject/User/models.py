from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    token = models.TextField()
    # 알림기능
    notification = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username