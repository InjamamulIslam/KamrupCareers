import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Download, ExternalLink } from 'lucide-react';

export default function Applications() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(title, company)')
      .order('created_at', { ascending: false });
      
    if (data) setApps(data);
    setLoading(false);
  }

  async function downloadCV(cvUrl: string) {
    const { data, error } = await supabase.storage.from('resumes').createSignedUrl(cvUrl, 60);
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    await supabase.from('applications').update({ status: newStatus }).eq('id', id);
    fetchApps();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Candidate Applications</h1>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-medium text-muted-foreground">Candidate</th>
                <th className="p-4 font-medium text-muted-foreground">Applied For</th>
                <th className="p-4 font-medium text-muted-foreground">Experience</th>
                <th className="p-4 font-medium text-muted-foreground">Status</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Resume</th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No applications found.</td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                    <td className="p-4">
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-muted-foreground">{app.email} • {app.phone}</p>
                    </td>
                    <td className="p-4">
                      {app.jobs ? (
                        <>
                          <p className="font-medium text-sm">{app.jobs.title}</p>
                          <p className="text-xs text-muted-foreground">{app.jobs.company}</p>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">General Application</span>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium">{app.experience}</p>
                      <p className="text-xs text-muted-foreground">{app.qualification}</p>
                    </td>
                    <td className="p-4">
                      <select 
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className="bg-transparent border border-border rounded-lg text-sm px-2 py-1 outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => downloadCV(app.cv_url)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition"
                      >
                        <Download size={16} /> CV
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
