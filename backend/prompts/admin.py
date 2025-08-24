from django.contrib import admin
from .models import Prompt


@admin.register(Prompt)
class PromptAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'response_style', 'created_at']
    list_filter = ['category', 'response_style', 'created_at']
    search_fields = ['title', 'user__username', 'input_text']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('user', 'title', 'input_text', 'category', 'response_style', 'description')
        }),
        ('Generated Content', {
            'fields': ('generated_prompt', 'ai_response'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
