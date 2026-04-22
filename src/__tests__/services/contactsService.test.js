import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitContact } from '../../services/contactsService';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from '../../lib/supabase';

describe('submitContact', () => {
  beforeEach(() => vi.clearAllMocks());

  const validInput = { name: 'Ege', email: 'ege@example.com', message: 'Hello there' };

  it('resolves on success', async () => {
    supabase.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    });

    await expect(submitContact(validInput)).resolves.toBeUndefined();
  });

  it('trims fields before inserting', async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValue({ insert: insertMock });

    await submitContact({ name: '  Ege  ', email: '  ege@example.com  ', message: '  Hello  ' });

    expect(insertMock).toHaveBeenCalledWith([{
      name: 'Ege',
      email: 'ege@example.com',
      message: 'Hello',
    }]);
  });

  it('throws on error', async () => {
    supabase.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: { message: 'Insert failed' } }),
    });

    await expect(submitContact(validInput)).rejects.toThrow('Insert failed');
  });
});
