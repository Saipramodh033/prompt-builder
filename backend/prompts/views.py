from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Prompt
from .serializers import (
    PromptSerializer,
    CreatePromptSerializer,
    UpdatePromptSerializer,
    ExecutePromptSerializer
)
from .services import create_and_execute_prompt, generate_prompt_template, execute_prompt_only


class PromptListCreateView(generics.ListCreateAPIView):
    """List user's prompts or create a new one"""
    
    serializer_class = PromptSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Prompt.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreatePromptSerializer
        return PromptSerializer
    
    def perform_create(self, serializer):
        # Generate the prompt template
        generated_prompt = generate_prompt_template(
            user=self.request.user,
            category=serializer.validated_data['category'],
            input_text=serializer.validated_data['input_text'],
            style=serializer.validated_data['response_style'],
            description=serializer.validated_data.get('description', '')
        )
        
        serializer.save(
            user=self.request.user,
            generated_prompt=generated_prompt
        )


class PromptDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a specific prompt"""
    
    serializer_class = PromptSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Prompt.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UpdatePromptSerializer
        return PromptSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def execute_prompt_view(request):
    """Execute a prompt with Gemini (without saving)"""
    
    serializer = ExecutePromptSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        try:
            result = execute_prompt_only(
                user=request.user,
                data=serializer.validated_data
            )
            
            return Response({
                'generated_prompt': result['generated_prompt'],
                'response': result['ai_response']
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'error': f'Failed to execute prompt: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats_view(request):
    """Get dashboard statistics for the user"""
    
    try:
        user_prompts = Prompt.objects.filter(user=request.user)
        
        # Calculate statistics
        total_prompts = user_prompts.count()
        total_executions = user_prompts.exclude(ai_response='').exclude(ai_response__isnull=True).count()
        
        # Find favorite category
        category_counts = {}
        for prompt in user_prompts:
            category_counts[prompt.category] = category_counts.get(prompt.category, 0) + 1
        
        favorite_category = max(category_counts.items(), key=lambda x: x[1])[0] if category_counts else ''
        
        # Recent activity
        recent_prompts = user_prompts.order_by('-created_at')[:5]
        
        return Response({
            'totalPrompts': total_prompts,  # Changed to camelCase
            'totalExecutions': total_executions,  # Changed to camelCase
            'favoriteCategory': favorite_category,  # Changed to camelCase
            'recentActivity': PromptSerializer(recent_prompts, many=True).data  # Changed to camelCase
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to fetch dashboard stats: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
