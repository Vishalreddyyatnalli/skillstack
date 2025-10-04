# SkillStack

SkillStack is a full-stack web application for tracking your learning progress across different skills, courses, and resources. Built with React + TypeScript for the frontend and Django REST Framework for the backend.

## Features

- 📊 Dashboard with learning statistics
- ✅ Track multiple skills and learning resources
- 📝 Add progress entries for each skill
- 📈 Monitor hours spent and completion status
- 🎯 Organize skills by resource type (video, course, article, book)

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Tailwind CSS for styling
- Axios for API communication

### Backend
- Django REST Framework
- SQLite database
- CORS support for frontend integration

## Project Structure

```
skillstack/
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── layouts/       # Layout components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   └── types/        # TypeScript definitions
│   └── ...
├── skills/                # Django app for skills management
│   ├── models.py         # Database models
│   ├── serializers.py    # DRF serializers
│   └── views.py          # API views
└── project/              # Django project configuration
```

## Getting Started

### Backend Setup

1. Create and activate a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

2. Install Python dependencies:
```bash
pip install django djangorestframework django-cors-headers
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the Django development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

- `GET /api/skills/` - List all skills
- `POST /api/skills/` - Create a new skill
- `GET /api/skills/:id/` - Get skill details
- `PUT /api/skills/:id/` - Update a skill
- `DELETE /api/skills/:id/` - Delete a skill
- `GET /api/skills/statistics/` - Get learning statistics

## Development

### Available Scripts

Frontend:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

Backend:
- `python manage.py runserver` - Start development server
- `python manage.py makemigrations` - Create new migrations
- `python manage.py migrate` - Apply migrations
- `python manage.py createsuperuser` - Create admin user

## Future Enhancements

- User authentication and authorization
- Multiple learning resource links per skill
- Progress visualization with charts
- Tags and categories for skills
- Learning goal setting and tracking
- Export/import functionality