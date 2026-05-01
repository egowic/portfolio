import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { LangProvider } from '../../context/LangContext';
import Projects from '../../components/Projects';
import type { Project } from '../../types';

vi.mock('../../lib/supabase', () => ({ supabase: { from: vi.fn() } }));
vi.mock('../../services/projectsService');
import { getProjects } from '../../services/projectsService';

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Portfolio Site',
    tag_en: 'Web',
    tag_tr: 'Web',
    year: '2024',
    desc_en: 'A personal portfolio built with React.',
    desc_tr: 'React ile yapılmış kişisel portföy.',
    tech: ['React', 'TypeScript'],
    link: 'https://example.com',
    order_index: 1,
  },
  {
    id: '2',
    title: 'Data Pipeline',
    tag_en: 'Backend',
    tag_tr: 'Backend',
    year: '2023',
    desc_en: 'A scalable data ingestion pipeline.',
    desc_tr: 'Ölçeklenebilir veri akış hattı.',
    tech: ['Python', 'Kafka'],
    link: null,
    order_index: 2,
  },
];

beforeEach(() => {
  localStorage.setItem('portfolio-lang', 'en');
  vi.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
});

function renderProjects() {
  return render(
    <LangProvider>
      <Projects />
    </LangProvider>
  );
}

describe('Projects', () => {
  it('shows no projects while loading', () => {
    vi.mocked(getProjects).mockReturnValue(new Promise(() => {}));
    renderProjects();
    expect(screen.queryByRole('article')).toBeNull();
  });

  it('renders projects after loading', async () => {
    vi.mocked(getProjects).mockResolvedValue(mockProjects);
    renderProjects();
    await waitFor(() => {
      expect(screen.getByText('Portfolio Site')).toBeInTheDocument();
      expect(screen.getByText('Data Pipeline')).toBeInTheDocument();
    });
  });

  it('renders project descriptions in English', async () => {
    vi.mocked(getProjects).mockResolvedValue(mockProjects);
    renderProjects();
    await waitFor(() => {
      expect(screen.getByText('A personal portfolio built with React.')).toBeInTheDocument();
    });
  });

  it('renders project descriptions in Turkish', async () => {
    localStorage.setItem('portfolio-lang', 'tr');
    vi.mocked(getProjects).mockResolvedValue(mockProjects);
    render(<LangProvider><Projects /></LangProvider>);
    await waitFor(() => {
      expect(screen.getByText('React ile yapılmış kişisel portföy.')).toBeInTheDocument();
    });
  });

  it('renders tech tags for each project', async () => {
    vi.mocked(getProjects).mockResolvedValue(mockProjects);
    renderProjects();
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
    });
  });

  it('renders visit site link only when link exists', async () => {
    vi.mocked(getProjects).mockResolvedValue(mockProjects);
    renderProjects();
    await waitFor(() => {
      const links = screen.getAllByRole('link', { name: /visit/i });
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute('href', 'https://example.com');
    });
  });

  it('shows error message when fetch fails', async () => {
    vi.mocked(getProjects).mockRejectedValue(new Error('DB connection failed'));
    renderProjects();
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('DB connection failed');
    });
  });

  it('shows filter buttons when there are multiple tag categories', async () => {
    vi.mocked(getProjects).mockResolvedValue(mockProjects);
    renderProjects();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Web' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Backend' })).toBeInTheDocument();
    });
  });

  it('filters projects by tag when filter button is clicked', async () => {
    vi.mocked(getProjects).mockResolvedValue(mockProjects);
    renderProjects();
    await waitFor(() => screen.getByText('Portfolio Site'));

    fireEvent.click(screen.getByRole('button', { name: 'Web' }));
    expect(screen.getByText('Portfolio Site')).toBeInTheDocument();
    expect(screen.queryByText('Data Pipeline')).not.toBeInTheDocument();
  });

  it('resets filter to all when All button is clicked', async () => {
    vi.mocked(getProjects).mockResolvedValue(mockProjects);
    renderProjects();
    await waitFor(() => screen.getByText('Portfolio Site'));

    fireEvent.click(screen.getByRole('button', { name: 'Web' }));
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('Portfolio Site')).toBeInTheDocument();
    expect(screen.getByText('Data Pipeline')).toBeInTheDocument();
  });

  it('toggles filter off when same tag clicked again', async () => {
    vi.mocked(getProjects).mockResolvedValue(mockProjects);
    renderProjects();
    await waitFor(() => screen.getByText('Portfolio Site'));

    fireEvent.click(screen.getByRole('button', { name: 'Web' }));
    fireEvent.click(screen.getByRole('button', { name: 'Web' }));
    expect(screen.getByText('Portfolio Site')).toBeInTheDocument();
    expect(screen.getByText('Data Pipeline')).toBeInTheDocument();
  });
});
