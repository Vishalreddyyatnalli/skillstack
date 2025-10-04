import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Skill } from '../types/index.ts';
import { skillsApi } from '../services/api';

export default function SkillsList() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillsApi.getAll();
        setSkills(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch skills');
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Skills</h1>
        <Link
          to="/add-skill"
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
        >
          Add New Skill
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {skills.map((skill) => (
            <div key={skill.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{skill.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {skill.platform} • {skill.resource_type}
                  </p>
                  {skill.description && (
                    <p className="text-gray-600 mt-2">{skill.description}</p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 text-sm rounded-full ${getProgressColor(skill.progress_status)}`}>
                    {skill.progress_status.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {skill.hours_spent} hours spent
                  </span>
                </div>
              </div>
              <div className="mt-4 flex space-x-4">
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  Update Progress
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-700">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}