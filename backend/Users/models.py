from django.contrib.auth.models import AbstractUser# Create your models here.
from django.db import models
class User(AbstractUser):
    phone = models.CharField(max_length=15, blank=True)
    bio = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)


    def __str__(self):
        return self.username