import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { ACCENT } from '../data';
import { getProjects } from '../services/projectsService';
import ProjectSkeleton from './ProjectSkeleton';
import type { Project } from '../types';

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
    <section
      id="projects"
      className="section-inner"
      aria-label="Projects"
      style={{ padding: '48px 48px 64px', maxWidth: 860, margin: '0 auto' }}
    >
      <hr className="divider" style={{ marginBottom: 64 }} />
      <div className="section-label">{t.s2label}</div>
      <h2 style={{ fontSize: 32, fontWeight: 300, color: '#f0ece5', marginBottom: 24, letterSpacing: '-0.02em' }}>
        {t.s2title}
      </h2>

      {!loading && !error && uniqueTagsEn.length > 1 && (
        <div role="group" aria-label="Filter projects by category" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {loading && <ProjectSkeleton />}
        {error && (
          <p className="mono" role="alert" style={{ fontSize: 12, color: '#c0392b' }}>{error}</p>
        )}
        {!loading && !error && filtered.map((p) => (
          <article
            key={p.id}
            className="card-hover project-card"
            style={{ border: '1px solid #18181c', borderRadius: 8, padding: '28px 32px', background: '#0d0d10' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span className="mono" style={{ fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {lang === 'tr' ? p.tag_tr : p.tag_en}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 400, color: '#f0ece5', marginTop: 6, letterSpacing: '-0.01em' }}>
                  {p.title}
                </h3>
              </div>
              <span className="mono" style={{ fontSize: 11, color: '#444' }}>{p.year}</span>
            </div>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>
              {lang === 'tr' ? p.desc_tr : p.desc_en}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(p.tech ?? []).map(tag => (
                  <span
                    key={tag}
                    className="mono"
                    style={{ fontSize: 10, color: '#555', background: '#111114', border: '1px solid #1e1e22', borderRadius: 4, padding: '3px 8px' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${p.title} site`}
                  className="mono project-visit-link"
                >
                  {t.visitSite}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
