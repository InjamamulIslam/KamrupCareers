import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    category: 'Sales',
    type: 'Full-Time',
    salary_range: '',
    description: '',
  });

  const CATEGORIES = ["Sales", "IT", "Marketing", "HR", "Finance", "Operations", "Office Jobs", "Other"];

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (data) setJobs(data);
    setLoading(false);
  }

  async function deleteJob(id: string) {
    if (confirm('Are you sure you want to delete this job?')) {
      await supabase.from('jobs').delete().eq('id', id);
      fetchJobs();
    }
  }

  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('jobs').insert([newJob]);
    if (!error) {
      setIsModalOpen(false);
      setNewJob({ title: '', company: '', location: '', category: 'Sales', type: 'Full-Time', salary_range: '', description: '' });
      fetchJobs();
    } else {
      alert("Error saving job: " + error.message);
    }
    setSaving(false);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Jobs</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={18} /> Add New Job
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-medium text-muted-foreground">Position</th>
                <th className="p-4 font-medium text-muted-foreground">Company</th>
                <th className="p-4 font-medium text-muted-foreground">Location</th>
                <th className="p-4 font-medium text-muted-foreground">Status</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No jobs found.</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                    <td className="p-4 font-medium">{job.title}</td>
                    <td className="p-4 text-muted-foreground">{job.company}</td>
                    <td className="p-4 text-muted-foreground">{job.location}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition"><Edit2 size={18} /></button>
                      <button onClick={() => deleteJob(job.id)} className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Job</h2>
            <form onSubmit={handleAddJob} className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title</label>
                <input required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-primary" placeholder="e.g. Area Sales Manager" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-primary" placeholder="Company Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-primary" placeholder="e.g. Guwahati" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={newJob.category} onChange={e => setNewJob({...newJob, category: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-primary">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-primary">
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary Range (Optional)</label>
                <input value={newJob.salary_range} onChange={e => setNewJob({...newJob, salary_range: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-primary" placeholder="e.g. ₹15,000 - ₹25,000 / month" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={4} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-primary" placeholder="Job responsibilities and requirements..." />
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-70 flex items-center gap-2">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  Save Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
