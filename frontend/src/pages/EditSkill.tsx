import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Skill } from '../types/index';
import { skillsApi } from '../services/api';

export default function EditSkill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    description: '',
    resource_type: 'course',
    platform: '',
    url: '',
    progress_status: 'not_started',
    hours_spent: 0,
    difficulty_rating: 1,
    notes: '',
  });

  useEffect(() => {
    const fetchSkill = async () => {
      if (!id) return;
      try {
        const response = await skillsApi.get(parseInt(id));
        setFormData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch skill details');
        setIsLoading(false);
      }
    };

    fetchSkill();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      await skillsApi.update(parseInt(id), formData);
      navigate('/skills');
    } catch (err) {
      setError('Failed to update skill');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let value: string | number = e.target.value;
    if (e.target.type === 'number') {
      value = parseFloat(e.target.value);
    }
    // Ensure difficulty_rating is always a number
    if (e.target.name === 'difficulty_rating') {
      value = parseInt(e.target.value, 10);
    }
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Skill</h1>
        <p className="mt-2 text-sm text-gray-600">Update your skill details and progress</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Skill Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="resource_type" className="block text-sm font-medium text-gray-700">
              Resource Type
            </label>
            <select
              id="resource_type"
              name="resource_type"
              value={formData.resource_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="video">Video</option>
              <option value="course">Course</option>
              <option value="article">Article</option>
              <option value="book">Book</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
              Platform
            </label>
            <input
              type="text"
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Resource URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="progress_status" className="block text-sm font-medium text-gray-700">
              Progress Status
            </label>
            <select
              id="progress_status"
              name="progress_status"
              value={formData.progress_status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="hours_spent" className="block text-sm font-medium text-gray-700">
              Hours Spent
            </label>
            <input
              type="number"
              id="hours_spent"
              name="hours_spent"
              min="0"
              step="0.5"
              value={formData.hours_spent}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="difficulty_rating" className="block text-sm font-medium text-gray-700">
              Difficulty Rating
            </label>
            <select
              id="difficulty_rating"
              name="difficulty_rating"
              value={formData.difficulty_rating}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value={1}>Beginner</option>
              <option value={2}>Elementary</option>
              <option value={3}>Intermediate</option>
              <option value={4}>Advanced</option>
              <option value={5}>Expert</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center justify-end gap-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/skills')}
            disabled={isSaving}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            {isSaving && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}