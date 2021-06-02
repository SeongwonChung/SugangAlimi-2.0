from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Course(models.Model):
    course_num = models.CharField(max_length=20)
    class_num = models.CharField(max_length=10)
    title = models.CharField(max_length=200)
    prof_name = models.CharField(max_length=100, null=True)
    time_room = models.CharField(max_length=200, null=True)

    # campus = models.CharField(max_length=10)
    # department = models.CharField(max_length=20)

    def __str__(self):
        return self.course_num + "-" + self.class_num


class Wish(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishes")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="wishes")

    def __str__(self):
        return (
            self.user.username
            + "/"
            + self.course.course_num
            + "-"
            + self.course.class_num
        )

    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(fields=["user", "course"], name="unique_wish")
    #     ]
