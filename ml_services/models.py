from django.db import models
from skills.models import Skill, LearningProgress

class SkillRecommendation(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='recommendations')
    recommended_skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='recommended_for')
    similarity_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('skill', 'recommended_skill')
        ordering = ['-similarity_score']

class NoteSummary(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='note_summaries')
    summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class SkillMasteryPrediction(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='mastery_predictions')
    predicted_date = models.DateField()
    confidence_score = models.FloatField()
    hours_per_week = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['predicted_date']

class SkillCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Skill Categories'

    def __str__(self):
        return self.name
