import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { getProjects } from '../services/projectsService';
import ProjectSkeleton from './ProjectSkeleton';
import type { Project } from '../types';

const TYPE_COLORS: Record<string, { color: string; borderColor: string; bg: string }> = {
  default: {
    color: 'var(--blue)',
    borderColor: 'rgba(79,142,247,0.25)',
    bg: 'rgba(79,142,247,0.06)',
  },
};

function getTypeStyle(tag: string) {
  const map: Record<string, { color: string; borderColor: string; bg: string }> = {
    'MSc Project': { color: 'var(--cyan)', borderColor: 'rgba(0,212,255,0.25)', bg: 'rgba(0,212,255,0.06)' },
    'Enterprise':  { color: '#a78bfa', borderColor: 'rgba(139,92,246,0.25)', bg: 'rgba(139,92,246,0.06)' },
    'Internship':  { color: 'var(--blue)', borderColor: 'rgba(79,142,247,0.25)', bg: 'rgba(79,142,247,0.06)' },
  };
  return map[tag] ?? TYPE_COLORS.default;
}

function ProjectCard({ p, lang }: { p: Project; lang: 'en' | 'tr' }) {
  const tag = lang === 'tr' ? p.tag_tr : p.tag_en;
  const style = getTypeStyle(p.tag_en);

  return (
    <article className="project-card">
      <div
        className="project-glow"
        style={{ background: `radial-gradient(circle, ${style.color.replace('var(--blue)', 'rgba(79,142,247,0.2)').replace('var(--cyan)', 'rgba(0,212,255,0.2)')}, transparent)` }}
      />
      <div className="project-top">
        <div
          className="project-type"
          style={{ color: style.color, borderColor: style.borderColor, background: style.bg }}
        >
          {tag}
        </div>
        {p.link ? (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-arrow"
            aria-label={`Visit ${p.title}`}
          >
            ↗
          </a>
        ) : (
          <div className="project-arrow" style={{ opacity: 0.3, cursor: 'default' }}>↗</div>
        )}
      </div>
      <div className="project-name">{p.title}</div>
      <p className="project-desc">{lang === 'tr' ? p.desc_tr : p.desc_en}</p>
      <div className="project-tags">
        {(p.tech ?? []).map(tag => (
          <span key={tag} className="project-tag">{tag}</span>
        ))}
      </div>
      {p.year && (
        <div style={{ marginTop: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-dim)' }}>
          {p.year}
        </div>
      )}
    </article>
  );
}

export default function Projects() {
  const { t, lang } = useLang();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTagEn, setActiveTagEn] = useState<string | null>(null);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const uniqueTagsEn = [...new Set(projects.map(p => p.tag_en))];
  const filtered = activeTagEn ? projects.filter(p => p.tag_en === activeTagEn) : projects;

  const tagLabel = (tagEn: string) => {
    const match = projects.find(p => p.tag_en === tagEn);
    return match ? (lang === 'tr' ? match.tag_tr : match.tag_en) : tagEn;
  };

  return (
    <section id="projects" className="projects-section" aria-label="Projects">
      <div className="section-inner">
        <div className="projects-header">
          <div>
            <div className="section-label fade-up">{t.s2label}</div>
            <h2 className="section-title fade-up">{t.s2title}</h2>
          </div>
        </div>

        {!loading && !error && uniqueTagsEn.length > 1 && (
          <div
            role="group"
            aria-label="Filter projects by category"
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}
          >
            <button
              className={`filter-btn${activeTagEn === null ? ' active' : ''}`}
              onClick={() => setActiveTagEn(null)}
              aria-pressed={activeTagEn === null}
            >
              {t.filterAll}
            </button>
            {uniqueTagsEn.map(tagEn => (
              <button
                key={tagEn}
                className={`filter-btn${activeTagEn === tagEn ? ' active' : ''}`}
                onClick={() => setActiveTagEn(prev => prev === tagEn ? null : tagEn)}
                aria-pressed={activeTagEn === tagEn}
              >
                {tagLabel(tagEn)}
              </button>
            ))}
          </div>
        )}

        <div className="projects-grid">
          {loading && <div style={{ gridColumn: '1/-1' }}><ProjectSkeleton /></div>}
          {error && (
            <p
              className="mono"
              role="alert"
              style={{ fontSize: 12, color: '#c0392b', gridColumn: '1/-1' }}
            >
              {error}
            </p>
          )}
          {!loading && !error && filtered.map(p => (
            <ProjectCard key={p.id} p={p} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
