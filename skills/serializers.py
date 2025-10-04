from django.db import models
from rest_framework import serializers
from .models import Skill, LearningProgress

class LearningProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningProgress
        fields = ['id', 'date', 'hours_spent', 'notes']

class SkillSerializer(serializers.ModelSerializer):
    progress_entries = LearningProgressSerializer(many=True, read_only=True)
    total_hours = serializers.SerializerMethodField()

    class Meta:
        model = Skill
        fields = [
            'id', 'name', 'description', 'resource_type', 'platform',
            'url', 'progress_status', 'hours_spent', 'difficulty_rating',
            'notes', 'created_at', 'updated_at', 'progress_entries',
            'total_hours'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_total_hours(self, obj):
        return obj.progress_entries.aggregate(
            total=models.Sum('hours_spent')
        )['total'] or 0