from django.db import models
from django.contrib.auth.models import AbstractUser
import os
import uuid

# Create your models here.
def profile_image_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('profile_pics', filename)


class Role(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Profile(AbstractUser):
    # Inherit fields from AbstractUser (username, password, email, first_name, last_name)
    birth_date = models.DateField(null=True, blank=True)
    number = models.CharField(max_length=15, blank=True)
    gender_choices = [('M', 'Male'), ('F', 'Female'), ('O', 'Other')]
    gender = models.CharField(max_length=1, choices=gender_choices, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    profile_picture = models.ImageField(upload_to=profile_image_path, null=True, blank=True)
    roles = models.ForeignKey(Role, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.username

