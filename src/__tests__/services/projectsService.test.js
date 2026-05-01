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
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Portfolio' }),
        expect.objectContaining({
          title: 'KeyboardCleaner',
          tag_en: 'macOS App',
          link: 'https://github.com/egowic/KeyboardCleaner',
        }),
      ])
    );
  });

  it('returns local projects when data is null', async () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });

    const result = await getProjects();
    expect(result).toEqual([
      expect.objectContaining({
        title: 'KeyboardCleaner',
        tag_en: 'macOS App',
      }),
    ]);
  });

  it('does not duplicate KeyboardCleaner when it exists in the database', async () => {
    const mockData = [
      { id: '1', title: 'Portfolio', order_index: 1 },
      { id: '2', title: 'KeyboardCleaner', order_index: 5 },
    ];
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }),
    });

    const result = await getProjects();
    expect(result.filter(project => project.title === 'KeyboardCleaner')).toHaveLength(1);
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
