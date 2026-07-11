import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Briefcase, Users, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      // Fetch Jobs
      const { data: jobs } = await supabase.from('jobs').select('status');
      // Fetch Applications
      const { data: applications } = await supabase.from('applications').select('status');

      if (jobs && applications) {
        setStats({
          totalJobs: jobs.length,
          openJobs: jobs.filter(j => j.status === 'open').length,
          totalApplications: applications.length,
          pendingApplications: applications.filter(a => a.status === 'pending').length
        });
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Open Jobs', value: stats.openJobs, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Applications', value: stats.totalApplications, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Pending Review', value: stats.pendingApplications, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      {loading ? (
        <div>Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-border flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
