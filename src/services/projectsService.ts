import { supabase } from '../lib/supabase';
import type { Project } from '../types';

export async function getProjects(): Promise<Project[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index');
  if (error) throw new Error(error.message);
  return (data as Project[]) ?? [];
}
