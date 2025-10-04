from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from .models import Skill, LearningProgress
from .serializers import SkillSerializer, LearningProgressSerializer

class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Skill.objects.all()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        queryset = self.get_queryset()
        total_skills = queryset.count()
        in_progress = queryset.filter(progress_status='in_progress').count()
        completed = queryset.filter(progress_status='completed').count()
        total_hours = queryset.aggregate(total=Sum('hours_spent'))['total'] or 0

        by_type = queryset.values('resource_type').annotate(
            count=Count('id')
        )

        return Response({
            'total_skills': total_skills,
            'in_progress': in_progress,
            'completed': completed,
            'total_hours': total_hours,
            'by_type': by_type
        })

class LearningProgressViewSet(viewsets.ModelViewSet):
    serializer_class = LearningProgressSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return LearningProgress.objects.all()
