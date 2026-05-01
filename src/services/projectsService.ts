import { supabase } from '../lib/supabase';
import type { Project } from '../types';

const KEYBOARD_CLEANER_PROJECT: Project = {
  id: 'keyboard-cleaner',
  title: 'KeyboardCleaner',
  tag_en: 'macOS App',
  tag_tr: 'macOS Uygulaması',
  year: '2026',
  desc_en:
    'Minimal macOS menu bar app that locks keyboard input so you can clean your keys without triggering shortcuts, while keeping trackpad and mouse control available.',
  desc_tr:
    'Klavyeyi temizlerken istenmeyen tuş girişlerini ve kısayolları engelleyen, trackpad ve mouse kullanımını açık bırakan minimal macOS menü bar uygulaması.',
  tech: ['Swift', 'SwiftUI', 'AppKit', 'Accessibility', 'Sparkle'],
  link: 'https://github.com/egowic/KeyboardCleaner',
  order_index: 5,
};

function withLocalProjects(projects: Project[]): Project[] {
  const hasKeyboardCleaner = projects.some(
    project => project.title.toLowerCase() === KEYBOARD_CLEANER_PROJECT.title.toLowerCase()
  );

  return hasKeyboardCleaner
    ? projects
    : [...projects, KEYBOARD_CLEANER_PROJECT].sort((a, b) => a.order_index - b.order_index);
}

export async function getProjects(): Promise<Project[]> {
  if (!supabase) return withLocalProjects([]);
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index');
  if (error) throw new Error(error.message);
  return withLocalProjects((data as Project[]) ?? []);
}
