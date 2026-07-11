import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  quote: string;
  sort_order: number;
  active: boolean;
};

const EMPTY: Omit<Testimonial, 'id' | 'created_at'> = {
  name: '', role: '', initials: '', color: '#155EEF', quote: '', sort_order: 0, active: true,
};

const inputCls = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10";

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Testimonial>>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch(); }, []);

  async function fetch() {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    if (data) setItems(data);
    setLoading(false);
  }

  function openNew() { setEditing({ ...EMPTY }); setShowModal(true); }
  function openEdit(t: Testimonial) { setEditing({ ...t }); setShowModal(true); }

  async function save() {
    setSaving(true);
    if (editing.id) {
      const { error } = await supabase.from('testimonials').update(editing).eq('id', editing.id);
      if (error) { toast.error('Failed to update'); } else { toast.success('Updated!'); }
    } else {
      const { error } = await supabase.from('testimonials').insert([editing]);
      if (error) { toast.error('Failed to add'); } else { toast.success('Added!'); }
    }
    setSaving(false);
    setShowModal(false);
    fetch();
  }

  async function remove(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    toast.success('Deleted');
    fetch();
  }

  async function toggleActive(t: Testimonial) {
    await supabase.from('testimonials').update({ active: !t.active }).eq('id', t.id);
    fetch();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer success stories shown on the homepage.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#2563EB]" size={32} /></div>
      ) : (
        <div className="space-y-4">
          {items.map((t) => (
            <div key={t.id} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="h-11 w-11 shrink-0 grid place-items-center rounded-full font-bold text-sm text-white" style={{ background: `linear-gradient(135deg, ${t.color}, #16B364)` }}>
                {t.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(t)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    t.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Check size={12} /> {t.active ? 'Active' : 'Hidden'}
                </button>
                <button onClick={() => openEdit(t)} className="p-2 rounded-lg text-gray-400 hover:text-[#2563EB] hover:bg-[#2563EB]/10 transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(t.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{editing.id ? 'Edit' : 'Add'} Testimonial</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className={inputCls} placeholder="Name" value={editing.name ?? ''} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))} />
                <input className={inputCls} placeholder="Initials (e.g. PD)" value={editing.initials ?? ''} onChange={(e) => setEditing((p) => ({ ...p, initials: e.target.value }))} />
              </div>
              <input className={inputCls} placeholder="Role (e.g. HR Executive · Company)" value={editing.role ?? ''} onChange={(e) => setEditing((p) => ({ ...p, role: e.target.value }))} />
              <textarea className={inputCls + ' resize-none'} rows={3} placeholder="Quote..." value={editing.quote ?? ''} onChange={(e) => setEditing((p) => ({ ...p, quote: e.target.value }))} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Avatar Color</label>
                  <input type="color" className="w-full h-10 rounded-xl border border-gray-200 cursor-pointer" value={editing.color ?? '#155EEF'} onChange={(e) => setEditing((p) => ({ ...p, color: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Sort Order</label>
                  <input className={inputCls} type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing((p) => ({ ...p, sort_order: parseInt(e.target.value) }))} />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition">Cancel</button>
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition disabled:opacity-70">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                {editing.id ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
