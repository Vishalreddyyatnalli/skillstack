# SkillStack Technical Documentation

This document provides detailed technical documentation for the SkillStack application, including architecture decisions, code organization, and implementation details.

## Architecture Overview

### Frontend Architecture

#### Component Structure
```
src/
├── components/           # Reusable UI components
│   ├── Header.tsx       # App header with navigation toggle
│   └── Sidebar.tsx      # Navigation sidebar
├── layouts/
│   └── Layout.tsx       # Main layout wrapper
├── pages/
│   ├── Dashboard.tsx    # Dashboard with statistics
│   ├── AddSkill.tsx     # Skill creation form
│   └── SkillsList.tsx   # Skills listing and management
├── services/
│   └── api.ts          # API client and endpoints
└── types/
    └── index.ts        # TypeScript type definitions
```

#### State Management
- Local state using React's `useState` for component-level state
- React Query could be added for server state management in future iterations

#### Routing
- React Router v6 for client-side routing
- Route definitions centralized in `App.tsx`
- Protected routes can be added in future with authentication

### Backend Architecture

#### Django Apps Structure
```
skills/
├── models.py           # Database models
├── serializers.py      # DRF serializers
├── views.py           # ViewSets and API endpoints
└── migrations/        # Database migrations
```

#### API Design
The API follows REST principles with the following structure:

```
/api/
├── skills/           # Skills management
│   ├── GET /        # List all skills
│   ├── POST /       # Create new skill
│   ├── GET /:id     # Retrieve skill
│   ├── PUT /:id     # Update skill
│   ├── DELETE /:id  # Delete skill
│   └── GET /statistics/  # Get learning statistics
└── progress/        # Learning progress
    ├── POST /       # Create progress entry
    ├── PUT /:id     # Update progress
    └── DELETE /:id  # Delete progress
```

## Data Models

### Skill Model
```python
class Skill(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    resource_type = models.CharField(
        max_length=20,
        choices=['video', 'course', 'article', 'book', 'other']
    )
    platform = models.CharField(max_length=100)
    url = models.URLField(blank=True)
    progress_status = models.CharField(
        max_length=20,
        choices=['not_started', 'in_progress', 'completed']
    )
    hours_spent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    difficulty_rating = models.IntegerField(
        choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')]
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### LearningProgress Model
```python
class LearningProgress(models.Model):
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='progress_entries'
    )
    date = models.DateField()
    hours_spent = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )
    notes = models.TextField(blank=True)
```

## Frontend Implementation Details

### TypeScript Types
```typescript
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
```

### API Service Layer
The frontend uses Axios for API communication:

```typescript
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});

export const skillsApi = {
    getAll: () => api.get('/skills/'),
    get: (id: number) => api.get(`/skills/${id}/`),
    create: (data: any) => api.post('/skills/', data),
    update: (id: number, data: any) => api.put(`/skills/${id}/`, data),
    delete: (id: number) => api.delete(`/skills/${id}/`),
    getStatistics: () => api.get('/skills/statistics/'),
};
```

## Backend Implementation Details

### ViewSets
```python
class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    
    def get_queryset(self):
        return Skill.objects.all()
        
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_skills': queryset.count(),
            'in_progress': queryset.filter(
                progress_status='in_progress'
            ).count(),
            'completed': queryset.filter(
                progress_status='completed'
            ).count(),
            'total_hours': queryset.aggregate(
                total=Sum('hours_spent')
            )['total'] or 0,
        })
```

### Serializers
```python
class SkillSerializer(serializers.ModelSerializer):
    progress_entries = LearningProgressSerializer(
        many=True,
        read_only=True
    )
    
    class Meta:
        model = Skill
        fields = '__all__'
```

## Configuration

### CORS Settings
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

### REST Framework Settings
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}
```

## Future Implementations

### Authentication
- JWT authentication can be implemented
- User-specific skill tracking
- Role-based access control

### Performance Optimizations
- API response caching
- Pagination for skills listing
- Optimistic UI updates

### Additional Features
1. Skill Categories and Tags
   - Add categorization to skills
   - Implement tag-based filtering

2. Progress Analytics
   - Advanced statistics and charts
   - Learning time tracking
   - Progress trends

3. Resource Management
   - File attachments for skills
   - Multiple resource links per skill
   - Resource completion tracking

4. Social Features
   - Skill sharing
   - Learning groups
   - Progress comparison

## Testing

### Frontend Testing
- Unit tests for components using React Testing Library
- Integration tests for API services
- End-to-end testing with Cypress

### Backend Testing
- Unit tests for models and serializers
- API endpoint testing
- Integration tests for complex features

## Deployment Considerations

### Frontend Deployment
- Build optimization with Vite
- Static file hosting
- Environment configuration

### Backend Deployment
- Database migration strategy
- Static files serving
- Security settings
- Environment variables