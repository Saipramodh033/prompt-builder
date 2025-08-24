from django.urls import path
from .views import (
    PromptListCreateView,
    PromptDetailView,
    execute_prompt_view,
    dashboard_stats_view
)

urlpatterns = [
    path('', PromptListCreateView.as_view(), name='prompt-list-create'),
    path('<int:pk>/', PromptDetailView.as_view(), name='prompt-detail'),
    path('execute/', execute_prompt_view, name='execute-prompt'),
    path('dashboard-stats/', dashboard_stats_view, name='dashboard-stats'),
]
