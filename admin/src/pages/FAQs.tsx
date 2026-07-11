import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

type FAQ = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
};

const EMPTY: Omit<FAQ, 'id' | 'created_at'> = { question: '', answer: '', sort_order: 0, active: true };
const inputCls = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10";

export default function FAQsAdmin() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<FAQ>>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchFaqs(); }, []);

  async function fetchFaqs() {
    setLoading(true);
    const { data } = await supabase.from('faqs').select('*').order('sort_order');
    if (data) setItems(data);
    setLoading(false);
  }

  function openNew() { setEditing({ ...EMPTY }); setShowModal(true); }
  function openEdit(f: FAQ) { setEditing({ ...f }); setShowModal(true); }

  async function save() {
    setSaving(true);
    if (editing.id) {
      const { error } = await supabase.from('faqs').update(editing).eq('id', editing.id);
      if (error) { toast.error('Failed to update'); } else { toast.success('Updated!'); }
    } else {
      const { error } = await supabase.from('faqs').insert([editing]);
      if (error) { toast.error('Failed to add'); } else { toast.success('Added!'); }
    }
    setSaving(false);
    setShowModal(false);
    fetchFaqs();
  }

  async function remove(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    await supabase.from('faqs').delete().eq('id', id);
    toast.success('Deleted');
    fetchFaqs();
  }

  async function toggleActive(f: FAQ) {
    await supabase.from('faqs').update({ active: !f.active }).eq('id', f.id);
    fetchFaqs();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage frequently asked questions shown on the homepage.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition">
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#2563EB]" size={32} /></div>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div key={f.id} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{f.question}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{f.answer}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-400 font-medium">#{f.sort_order}</span>
                <button
                  onClick={() => toggleActive(f)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    f.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Check size={12} /> {f.active ? 'Active' : 'Hidden'}
                </button>
                <button onClick={() => openEdit(f)} className="p-2 rounded-lg text-gray-400 hover:text-[#2563EB] hover:bg-[#2563EB]/10 transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(f.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{editing.id ? 'Edit' : 'Add'} FAQ</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <input className={inputCls} placeholder="Question" value={editing.question ?? ''} onChange={(e) => setEditing((p) => ({ ...p, question: e.target.value }))} />
              <textarea className={inputCls + ' resize-none'} rows={4} placeholder="Answer..." value={editing.answer ?? ''} onChange={(e) => setEditing((p) => ({ ...p, answer: e.target.value }))} />
              <input className={inputCls} type="number" placeholder="Sort order (1, 2, 3...)" value={editing.sort_order ?? 0} onChange={(e) => setEditing((p) => ({ ...p, sort_order: parseInt(e.target.value) }))} />
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
