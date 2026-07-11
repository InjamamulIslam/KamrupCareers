import { X } from 'lucide-react';
import { useState } from 'react';
import { useSiteSettings } from '@/lib/useSiteSettings';

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-[#2563EB] text-white',
  green: 'bg-[#16B364] text-white',
  amber: 'bg-amber-500 text-white',
};

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { data: settings } = useSiteSettings();

  if (!settings) return null;
  if (settings.banner_enabled !== 'true') return null;
  if (dismissed) return null;

  const colorClass = COLOR_MAP[settings.banner_color ?? 'blue'] ?? COLOR_MAP.blue;

  return (
    <div className={`relative z-50 flex items-center justify-center px-4 py-2.5 text-sm font-medium ${colorClass}`}>
      <span>{settings.banner_text}</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 transition"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
