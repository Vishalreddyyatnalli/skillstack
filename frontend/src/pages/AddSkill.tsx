import { useState } from 'react';
import type { ResourceType, DifficultyLevel } from '../types/index.ts';
import { skillsApi } from '../services/api';

export default function AddSkill() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const skillData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      resource_type: formData.get('resource_type') as ResourceType,
      platform: formData.get('platform') as string,
      url: formData.get('url') as string,
      difficulty_rating: Number(formData.get('difficulty_rating')) as DifficultyLevel,
      notes: formData.get('notes') as string,
      progress_status: 'not_started',
      hours_spent: 0,
    };

    try {
      await skillsApi.create(skillData);
      // Reset form
      e.currentTarget.reset();
    } catch (err) {
      setError('Failed to create skill. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Skill</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Skill Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="input mt-1"
            placeholder="e.g., React Development"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="input mt-1"
            placeholder="Brief description of what you want to learn"
          />
        </div>

        <div>
          <label htmlFor="resource_type" className="block text-sm font-medium text-gray-700">
            Resource Type
          </label>
          <select
            name="resource_type"
            id="resource_type"
            required
            className="input mt-1"
          >
            <option value="course">Course</option>
            <option value="video">Video</option>
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
            name="platform"
            id="platform"
            required
            className="input mt-1"
            placeholder="e.g., Udemy, YouTube, Coursera"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Resource URL
          </label>
          <input
            type="url"
            name="url"
            id="url"
            className="input mt-1"
            placeholder="https://..."
          />
        </div>

        <div>
          <label htmlFor="difficulty_rating" className="block text-sm font-medium text-gray-700">
            Difficulty Level
          </label>
          <select
            name="difficulty_rating"
            id="difficulty_rating"
            required
            className="input mt-1"
          >
            <option value="1">Beginner</option>
            <option value="2">Elementary</option>
            <option value="3">Intermediate</option>
            <option value="4">Advanced</option>
            <option value="5">Expert</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            className="input mt-1"
            placeholder="Any additional notes or goals"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Adding Skill...' : 'Add Skill'}
          </button>
        </div>
      </form>
    </div>
  );
}