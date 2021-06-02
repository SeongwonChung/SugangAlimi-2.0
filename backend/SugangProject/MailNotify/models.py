from django.db import models
from ClassStatus.models import Course

# Create your models here.
class Registration(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE, primary_key=True)
    one_apply = models.IntegerField(null=True)
    one_limit = models.IntegerField(null=True)
    two_apply = models.IntegerField(null=True)
    two_limit = models.IntegerField(null=True)
    three_apply = models.IntegerField(null=True)
    three_limit = models.IntegerField(null=True)
    four_apply = models.IntegerField(null=True)
    four_limit = models.IntegerField(null=True)
    exchange_apply = models.IntegerField(null=True)
    exchange_limit = models.IntegerField(null=True)
    grad_apply = models.IntegerField(null=True)
    grad_limit = models.IntegerField(null=True)
    total_apply = models.IntegerField(null=True)
    total_limit = models.IntegerField(null=True)
