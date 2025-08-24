from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with additional fields"""
    
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('educator', 'Educator'),
        ('researcher', 'Researcher'),
        ('developer', 'Developer'),
        ('designer', 'Designer'),
        ('writer', 'Writer'),
        ('marketer', 'Marketer'),
        ('entrepreneur', 'Entrepreneur'),
        ('other', 'Other'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='other')
    preferences = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'auth_user'
        
    def __str__(self):
        return self.username
