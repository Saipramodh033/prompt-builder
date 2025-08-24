from rest_framework import serializers
from .models import Prompt


class PromptSerializer(serializers.ModelSerializer):
    """Serializer for Prompt model"""
    
    class Meta:
        model = Prompt
        fields = [
            'id', 'title', 'input_text', 'category', 'response_style',
            'description', 'generated_prompt', 'ai_response', 'user',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'generated_prompt', 'ai_response', 'created_at', 'updated_at']


class CreatePromptSerializer(serializers.ModelSerializer):
    """Serializer for creating prompts"""
    
    class Meta:
        model = Prompt
        fields = ['title', 'input_text', 'category', 'response_style', 'description', 'ai_response']


class UpdatePromptSerializer(serializers.ModelSerializer):
    """Serializer for updating prompts including AI response"""
    
    class Meta:
        model = Prompt
        fields = ['title', 'input_text', 'category', 'response_style', 'description', 'ai_response']


class ExecutePromptSerializer(serializers.Serializer):
    """Serializer for executing prompts"""
    
    prompt_id = serializers.IntegerField(required=False)
    input_text = serializers.CharField()
    category = serializers.ChoiceField(choices=Prompt.CATEGORY_CHOICES)
    response_style = serializers.ChoiceField(choices=Prompt.STYLE_CHOICES)
    description = serializers.CharField(required=False, allow_blank=True)
    
    def validate_prompt_id(self, value):
        if value and not Prompt.objects.filter(id=value, user=self.context['request'].user).exists():
            raise serializers.ValidationError("Prompt not found or you don't have permission to access it.")
        return value
