import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type SiteSettings = Record<string, string>;

async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) throw error;

  return Object.fromEntries((data || []).map((row) => [row.key, row.value ?? '']));
}

export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: ['site_settings'],
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    gcTime: 1000 * 60 * 10,
  });
}

export function useSetting(key: string, fallback = '') {
  const { data } = useSiteSettings();
  return data?.[key] ?? fallback;
}
