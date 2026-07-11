import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, MailOpen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => { fetchMessages(); }, []);

  async function fetchMessages() {
    setLoading(true);
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  }

  async function open(msg: Message) {
    setSelected(msg);
    if (!msg.read) {
      await supabase.from('contact_messages').update({ read: true }).eq('id', msg.id);
      fetchMessages();
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    toast.success('Deleted');
    if (selected?.id === id) setSelected(null);
    fetchMessages();
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Messages
          {unreadCount > 0 && (
            <span className="rounded-full bg-[#2563EB] px-2.5 py-0.5 text-xs font-bold text-white">{unreadCount} new</span>
          )}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Contact form submissions from the public website.</p>
      </div>

      <div className="flex gap-6 h-[600px]">
        {/* Message List */}
        <div className="w-80 shrink-0 flex flex-col border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b border-gray-100 font-semibold text-sm text-gray-700">
            {messages.length} messages
          </div>
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#2563EB]" size={24} />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">No messages yet</div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => open(msg)}
                  className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition ${
                    selected?.id === msg.id ? 'bg-[#2563EB]/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {msg.read ? (
                      <MailOpen size={14} className="text-gray-400 shrink-0" />
                    ) : (
                      <Mail size={14} className="text-[#2563EB] shrink-0" />
                    )}
                    <p className={`text-sm truncate ${msg.read ? 'text-gray-600' : 'font-semibold text-gray-900'}`}>
                      {msg.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate ml-5">{msg.subject || 'No subject'}</p>
                  <p className="text-xs text-gray-400 mt-0.5 ml-5">
                    {new Date(msg.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="flex-1 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {selected ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selected.subject || '(No subject)'}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    From <span className="font-medium text-gray-700">{selected.name}</span>
                    {' · '}
                    <a href={`mailto:${selected.email}`} className="text-[#2563EB] hover:underline">{selected.email}</a>
                    {' · '}
                    {new Date(selected.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition"
                  >
                    <Mail size={14} /> Reply
                  </a>
                  <button
                    onClick={() => remove(selected.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Mail size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
