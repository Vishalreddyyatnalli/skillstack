from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .services import (
    SkillRecommender,
    NoteSummarizer,
    MasteryPredictor,
    SkillCategorizer
)
from skills.models import Skill
from .models import (
    SkillRecommendation,
    NoteSummary,
    SkillMasteryPrediction,
    SkillCategory
)
from rest_framework.permissions import AllowAny

class MLServicesViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['get'])
    def recommend_skills(self, request, pk=None):
        """Get skill recommendations based on a target skill"""
        try:
            target_skill = Skill.objects.get(pk=pk)
            all_skills = Skill.objects.all()
            
            recommender = SkillRecommender()
            recommendations = recommender.recommend_skills(target_skill, all_skills)
            
            # Save recommendations to database
            for skill, score in recommendations:
                SkillRecommendation.objects.update_or_create(
                    skill=target_skill,
                    recommended_skill=skill,
                    defaults={'similarity_score': float(score)}
                )
            
            response_data = [{
                'id': skill.id,
                'name': skill.name,
                'similarity': float(score)
            } for skill, score in recommendations]
            
            return Response(response_data)
        except Skill.DoesNotExist:
            return Response(
                {'error': 'Skill not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def summarize_notes(self, request, pk=None):
        """Generate a summary of skill notes"""
        try:
            skill = Skill.objects.get(pk=pk)
            notes = f"{skill.description}\n{skill.notes}"
            
            summarizer = NoteSummarizer()
            summary = summarizer.summarize_notes(notes)
            
            # Save summary to database
            note_summary = NoteSummary.objects.create(
                skill=skill,
                summary=summary
            )
            
            return Response({'summary': summary})
        except Skill.DoesNotExist:
            return Response(
                {'error': 'Skill not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def predict_mastery(self, request, pk=None):
        """Predict skill mastery date"""
        try:
            skill = Skill.objects.get(pk=pk)
            progress_entries = skill.progress_entries.all()
            
            predictor = MasteryPredictor()
            predicted_date, confidence = predictor.predict_mastery_date(
                skill, progress_entries
            )
            
            if predicted_date:
                # Save prediction to database
                prediction = SkillMasteryPrediction.objects.create(
                    skill=skill,
                    predicted_date=predicted_date,
                    confidence_score=confidence,
                    hours_per_week=7  # Default assumption
                )
                
                return Response({
                    'predicted_date': predicted_date,
                    'confidence': confidence
                })
            else:
                return Response({
                    'message': 'Insufficient data for prediction'
                })
        except Skill.DoesNotExist:
            return Response(
                {'error': 'Skill not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def auto_categorize(self, request, pk=None):
        """Auto-categorize a skill based on its content"""
        try:
            skill = Skill.objects.get(pk=pk)
            skill_text = f"{skill.name} {skill.description}"
            
            # Get existing categories or create default ones
            categories = list(SkillCategory.objects.values_list('name', flat=True))
            if not categories:
                default_categories = [
                    'Programming',
                    'Design',
                    'Business',
                    'Marketing',
                    'Data Science',
                    'Personal Development'
                ]
                for cat in default_categories:
                    SkillCategory.objects.get_or_create(
                        name=cat,
                        defaults={'description': f'Skills related to {cat}'}
                    )
                categories = default_categories
            
            categorizer = SkillCategorizer()
            category, confidence = categorizer.categorize_skill(skill_text, categories)
            
            return Response({
                'category': category,
                'confidence': confidence
            })
        except Skill.DoesNotExist:
            return Response(
                {'error': 'Skill not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
