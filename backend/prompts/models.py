from django.db import models
from django.conf import settings


class Prompt(models.Model):
    """Model for storing user prompts"""
    
    CATEGORY_CHOICES = [
        ('doubt', 'Question & Doubt'),
        ('image_generation', 'Image Generation'),
        ('learning_roadmap', 'Learning Roadmap'),
        ('video_generation', 'Video Generation'),
        ('deep_research', 'Deep Research'),
        ('idea_exploration', 'Idea Exploration'),
    ]
    
    STYLE_CHOICES = [
        ('concise', 'Concise'),
        ('detailed', 'Detailed'),
        ('creative', 'Creative'),
        ('formal', 'Formal'),
        ('technical', 'Technical'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='prompts')
    title = models.CharField(max_length=200)
    input_text = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    response_style = models.CharField(max_length=20, choices=STYLE_CHOICES)
    description = models.TextField(blank=True)
    generated_prompt = models.TextField()
    ai_response = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} - {self.user.username}"
