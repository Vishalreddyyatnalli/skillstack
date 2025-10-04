from django.db import models
from django.contrib.auth.models import User

class Skill(models.Model):
    RESOURCE_TYPES = (
        ('video', 'Video'),
        ('course', 'Course'),
        ('article', 'Article'),
        ('book', 'Book'),
        ('other', 'Other'),
    )
    
    PROGRESS_STATUS = (
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )
    
    DIFFICULTY_LEVELS = (
        (1, 'Beginner'),
        (2, 'Elementary'),
        (3, 'Intermediate'),
        (4, 'Advanced'),
        (5, 'Expert'),
    )
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    platform = models.CharField(max_length=100)  # e.g., Udemy, YouTube, Coursera
    url = models.URLField(blank=True)
    progress_status = models.CharField(max_length=20, choices=PROGRESS_STATUS, default='not_started')
    hours_spent = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    difficulty_rating = models.IntegerField(choices=DIFFICULTY_LEVELS, default=1)
    notes = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class LearningProgress(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='progress_entries')
    date = models.DateField()
    hours_spent = models.DecimalField(max_digits=4, decimal_places=1)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-date']
        
    def __str__(self):
        return f"{self.skill.name} - {self.date}"
