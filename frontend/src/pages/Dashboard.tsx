import { useEffect, useState } from 'react';
import type { Skill, SkillStats } from '../types';
import { skillsApi } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState<SkillStats | null>(null);
  const [recentSkills, setRecentSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, skillsData] = await Promise.all([
          skillsApi.getStatistics(),
          skillsApi.getAll()
        ]);
        setStats(statsData.data);
        setRecentSkills(skillsData.data.slice(0, 3));
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Total Skills</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats?.total_skills || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Across all categories</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats?.in_progress || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Currently learning</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats?.completed || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Skills mastered</p>
        </div>
      </div>

      {/* Recent Skills */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Skills</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {recentSkills.map((skill) => (
              <div key={skill.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{skill.name}</h3>
                    <p className="text-sm text-gray-500">
                      {skill.platform} • {skill.progress_status.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-3 py-1 text-sm text-primary-700 bg-primary-100 rounded-full">
                      {skill.hours_spent} hrs spent
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 rounded-full h-2" 
                      style={{
                        width: `${skill.progress_status === 'completed' ? 100 : 
                               skill.progress_status === 'in_progress' ? 60 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}