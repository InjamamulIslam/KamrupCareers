import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, Settings, Globe, BarChart2, Megaphone, Search, Share2 } from 'lucide-react';
import { toast } from 'sonner';

type Settings = Record<string, string>;

const TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'hero', label: 'Hero Section', icon: Globe },
  { id: 'social', label: 'Social & Contact', icon: Share2 },
  { id: 'stats', label: 'Stats', icon: BarChart2 },
  { id: 'banner', label: 'Banner', icon: Megaphone },
  { id: 'seo', label: 'SEO', icon: Search },
];

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10";
const textareaCls = inputCls + " resize-none";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('key, value');
    if (data) {
      setSettings(Object.fromEntries(data.map((r) => [r.key, r.value ?? ''])));
    }
    setLoading(false);
  }

  function update(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function saveAll() {
    setSaving(true);
    const entries = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('site_settings').upsert(entries, { onConflict: 'key' });
    setSaving(false);

    if (error) {
      toast.error('Failed to save settings. Please try again.');
    } else {
      toast.success('Settings saved successfully!');
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Control every aspect of your public website from here.</p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition disabled:opacity-70"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-[#2563EB]/10 text-[#2563EB]'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">General Settings</h2>
              <Field label="Site Name" description="Appears in the footer and browser title.">
                <input className={inputCls} value={settings.site_name ?? ''} onChange={(e) => update('site_name', e.target.value)} />
              </Field>
              <Field label="Tagline" description="Appears under the logo in the navbar.">
                <input className={inputCls} value={settings.tagline ?? ''} onChange={(e) => update('tagline', e.target.value)} />
              </Field>
              <Field label="Footer Description" description="Short paragraph in the footer.">
                <textarea className={textareaCls} rows={3} value={settings.footer_description ?? ''} onChange={(e) => update('footer_description', e.target.value)} />
              </Field>
              <Field label="Contact Email" description="Shown in footer and contact page.">
                <input className={inputCls} type="email" value={settings.contact_email ?? ''} onChange={(e) => update('contact_email', e.target.value)} />
              </Field>
              <Field label="Contact Phone" description="Shown on the contact page.">
                <input className={inputCls} value={settings.contact_phone ?? ''} onChange={(e) => update('contact_phone', e.target.value)} />
              </Field>
              <Field label="Office Address" description="Shown in footer and contact page.">
                <input className={inputCls} value={settings.contact_address ?? ''} onChange={(e) => update('contact_address', e.target.value)} />
              </Field>
              <Field label="Office Hours" description="Shown on the contact page.">
                <input className={inputCls} value={settings.office_hours ?? ''} onChange={(e) => update('office_hours', e.target.value)} />
              </Field>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Hero Section</h2>
              <Field label="Badge Text" description="Small badge above the headline.">
                <input className={inputCls} value={settings.hero_badge_text ?? ''} onChange={(e) => update('hero_badge_text', e.target.value)} />
              </Field>
              <Field label="Headline" description="Main H1 heading on the homepage.">
                <input className={inputCls} value={settings.hero_headline ?? ''} onChange={(e) => update('hero_headline', e.target.value)} />
              </Field>
              <Field label="Sub-text" description="Paragraph below the headline.">
                <textarea className={textareaCls} rows={3} value={settings.hero_subtext ?? ''} onChange={(e) => update('hero_subtext', e.target.value)} />
              </Field>
              <Field label="Primary Button Text">
                <input className={inputCls} value={settings.hero_btn_primary ?? ''} onChange={(e) => update('hero_btn_primary', e.target.value)} />
              </Field>
              <Field label="Secondary Button Text">
                <input className={inputCls} value={settings.hero_btn_secondary ?? ''} onChange={(e) => update('hero_btn_secondary', e.target.value)} />
              </Field>
              <Field label="CTA Section Headline" description="Bottom 'Still Looking for a Job?' section.">
                <input className={inputCls} value={settings.cta_headline ?? ''} onChange={(e) => update('cta_headline', e.target.value)} />
              </Field>
              <Field label="CTA Sub-text">
                <textarea className={textareaCls} rows={2} value={settings.cta_subtext ?? ''} onChange={(e) => update('cta_subtext', e.target.value)} />
              </Field>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Social & Contact Links</h2>
              <Field label="Facebook URL">
                <input className={inputCls} placeholder="https://facebook.com/..." value={settings.social_facebook ?? ''} onChange={(e) => update('social_facebook', e.target.value)} />
              </Field>
              <Field label="Instagram URL">
                <input className={inputCls} placeholder="https://instagram.com/..." value={settings.social_instagram ?? ''} onChange={(e) => update('social_instagram', e.target.value)} />
              </Field>
              <Field label="LinkedIn URL">
                <input className={inputCls} placeholder="https://linkedin.com/company/..." value={settings.social_linkedin ?? ''} onChange={(e) => update('social_linkedin', e.target.value)} />
              </Field>
              <Field label="WhatsApp Number" description="Include country code, e.g. 919876543210">
                <input className={inputCls} placeholder="919876543210" value={settings.whatsapp_number ?? ''} onChange={(e) => update('whatsapp_number', e.target.value)} />
              </Field>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Homepage Stats Counter</h2>
              <p className="text-sm text-gray-500">These are the animated counter numbers on the homepage trust bar.</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Successful Placements">
                  <input className={inputCls} type="number" value={settings.stat_placements ?? '1200'} onChange={(e) => update('stat_placements', e.target.value)} />
                </Field>
                <Field label="Hiring Companies">
                  <input className={inputCls} type="number" value={settings.stat_companies ?? '180'} onChange={(e) => update('stat_companies', e.target.value)} />
                </Field>
                <Field label="Registered Candidates">
                  <input className={inputCls} type="number" value={settings.stat_candidates ?? '8500'} onChange={(e) => update('stat_candidates', e.target.value)} />
                </Field>
                <Field label="Active Jobs">
                  <input className={inputCls} type="number" value={settings.stat_active_jobs ?? '45'} onChange={(e) => update('stat_active_jobs', e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {activeTab === 'banner' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Announcement Banner</h2>
              <p className="text-sm text-gray-500">Show a dismissable banner at the top of all pages.</p>
              <Field label="Banner Status">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => update('banner_enabled', settings.banner_enabled === 'true' ? 'false' : 'true')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      settings.banner_enabled === 'true' ? 'bg-[#2563EB]' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.banner_enabled === 'true' ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    {settings.banner_enabled === 'true' ? 'Enabled (visible on site)' : 'Disabled'}
                  </span>
                </div>
              </Field>
              <Field label="Banner Text" description="The message displayed in the banner.">
                <input className={inputCls} value={settings.banner_text ?? ''} onChange={(e) => update('banner_text', e.target.value)} />
              </Field>
              <Field label="Banner Color">
                <div className="flex gap-3">
                  {['blue', 'green', 'amber'].map((color) => (
                    <button
                      key={color}
                      onClick={() => update('banner_color', color)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium capitalize transition ${
                        settings.banner_color === color
                          ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full ${
                        color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : 'bg-amber-500'
                      }`} />
                      {color}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">SEO Settings</h2>
              <Field label="Homepage Meta Title" description="Shown in browser tab and Google search results.">
                <input className={inputCls} value={settings.seo_title ?? ''} onChange={(e) => update('seo_title', e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">{(settings.seo_title ?? '').length}/60 chars recommended</p>
              </Field>
              <Field label="Homepage Meta Description" description="Shown in Google search result snippets.">
                <textarea className={textareaCls} rows={3} value={settings.seo_description ?? ''} onChange={(e) => update('seo_description', e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">{(settings.seo_description ?? '').length}/160 chars recommended</p>
              </Field>
              <Field label="OG Image URL" description="Image shown when someone shares your site on social media.">
                <input className={inputCls} placeholder="https://..." value={settings.seo_og_image ?? ''} onChange={(e) => update('seo_og_image', e.target.value)} />
              </Field>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
