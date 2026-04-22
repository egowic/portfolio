import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProjects } from '../../services/projectsService';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(),
      })),
    })),
  },
}));

import { supabase } from '../../lib/supabase';

describe('getProjects', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns projects on success', async () => {
    const mockData = [{ id: '1', title: 'Portfolio', order_index: 1 }];
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }),
    });

    const result = await getProjects();
    expect(result).toEqual(mockData);
  });

  it('returns empty array when data is null', async () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });

    const result = await getProjects();
    expect(result).toEqual([]);
  });

  it('throws on error', async () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
      }),
    });

    await expect(getProjects()).rejects.toThrow('DB error');
  });
});
