import { supabase } from '../lib/supabase';

export async function submitContact({ name, email, message }) {
  const { error } = await supabase.from('contacts').insert([{
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  }]);
  if (error) throw new Error(error.message);
}
