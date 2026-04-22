import { supabase } from '../lib/supabase';
import type { ContactFormData } from '../types';

export async function submitContact({ name, email, message }: ContactFormData): Promise<void> {
  const { error } = await supabase.from('contacts').insert([{
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  }]);
  if (error) throw new Error(error.message);
}
