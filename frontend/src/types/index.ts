export type ResourceType = 'video' | 'course' | 'article' | 'book' | 'other';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  id: number;
  name: string;
  description: string;
  resource_type: ResourceType;
  platform: string;
  url?: string;
  progress_status: ProgressStatus;
  hours_spent: number;
  difficulty_rating: DifficultyLevel;
  notes: string;
  created_at: string;
  updated_at: string;
  progress_entries: LearningProgress[];
}

export interface LearningProgress {
  id: number;
  date: string;
  hours_spent: number;
  notes: string;
}

export interface SkillStats {
  total_skills: number;
  in_progress: number;
  completed: number;
  total_hours: number;
  by_type: {
    resource_type: ResourceType;
    count: number;
  }[];
}