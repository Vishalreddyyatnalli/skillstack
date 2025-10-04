from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from transformers import pipeline
from datetime import datetime, timedelta
import pandas as pd
from sklearn.linear_model import LinearRegression

class SkillRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
    
    def recommend_skills(self, target_skill, all_skills, max_recommendations=5):
        """
        Recommend similar skills based on content similarity
        """
        # Combine skill name, description, and notes for better context
        skill_texts = [
            f"{skill.name} {skill.description} {skill.notes}"
            for skill in all_skills
        ]
        
        # Create TF-IDF matrix
        tfidf_matrix = self.vectorizer.fit_transform(skill_texts)
        
        # Calculate similarity scores
        cosine_scores = cosine_similarity(tfidf_matrix)
        
        # Get index of target skill
        target_idx = [i for i, skill in enumerate(all_skills) if skill.id == target_skill.id][0]
        
        # Get similar skills (excluding self)
        similar_indices = np.argsort(cosine_scores[target_idx])[::-1][1:max_recommendations+1]
        
        recommendations = [
            (all_skills[idx], cosine_scores[target_idx][idx])
            for idx in similar_indices
        ]
        
        return recommendations

class NoteSummarizer:
    def __init__(self):
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    
    def summarize_notes(self, text, max_length=130, min_length=30):
        """
        Generate a concise summary of skill notes
        """
        if len(text.split()) < min_length:
            return text
            
        summary = self.summarizer(text, max_length=max_length, min_length=min_length,
                                do_sample=False)[0]['summary_text']
        return summary

class MasteryPredictor:
    def predict_mastery_date(self, skill, progress_entries):
        """
        Predict skill mastery date based on learning patterns
        """
        if not progress_entries:
            return None, 0
            
        # Create a dataframe of progress entries
        df = pd.DataFrame([
            {
                'date': entry.date,
                'hours_spent': float(entry.hours_spent)
            }
            for entry in progress_entries
        ])
        
        # Calculate features
        df['days_from_start'] = (df['date'] - df['date'].min()).dt.days
        
        # Simple linear regression on cumulative hours
        df['cumulative_hours'] = df['hours_spent'].cumsum()
        
        model = LinearRegression()
        X = df[['days_from_start']]
        y = df['cumulative_hours']
        
        model.fit(X, y)
        
        # Estimate days needed to reach mastery (assuming 40 hours for mastery)
        target_hours = 40
        current_hours = df['cumulative_hours'].iloc[-1]
        remaining_hours = target_hours - current_hours
        
        if remaining_hours <= 0:
            return datetime.now().date(), 1.0
            
        daily_rate = model.coef_[0]
        if daily_rate <= 0:
            return None, 0
            
        days_to_mastery = remaining_hours / daily_rate
        predicted_date = datetime.now().date() + timedelta(days=int(days_to_mastery))
        
        # Calculate confidence score based on R-squared
        confidence = model.score(X, y)
        
        return predicted_date, confidence

class SkillCategorizer:
    def __init__(self):
        self.classifier = pipeline("zero-shot-classification",
                                 model="facebook/bart-large-mnli")
    
    def categorize_skill(self, skill_text, categories):
        """
        Auto-categorize skills using zero-shot classification
        """
        results = self.classifier(
            sequences=skill_text,
            candidate_labels=categories,
            multi_label=False
        )
        
        return results['labels'][0], results['scores'][0]