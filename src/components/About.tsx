import { useLang } from '../context/LangContext';
import { SKILLS, EXPERIENCE } from '../data';

const SKILL_GROUPS = [
  { label: 'Languages', skills: ['Java', 'Python', 'JavaScript', 'SQL', 'C#'] },
  { label: 'Backend & Data', skills: ['REST APIs', 'Backend Dev', 'MongoDB', 'Big Data'] },
  { label: 'Frontend & Tools', skills: ['HTML/CSS', 'React', 'Git', 'Agile'] },
];

const ALL_SKILLS = new Set(SKILLS);

function SkillGroups() {
  const remaining = SKILLS.filter(s => !SKILL_GROUPS.flatMap(g => g.skills).includes(s));
  const groups = remaining.length > 0
    ? [...SKILL_GROUPS, { label: 'Other', skills: remaining }]
    : SKILL_GROUPS;

  return (
    <>
      {groups.map(group => (
        <div key={group.label} className="skills-group">
          <div className="skills-group-label">{group.label}</div>
          <div className="skills-pills">
            {group.skills.filter(s => ALL_SKILLS.has(s)).map(s => (
              <span key={s} className="skill-pill">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default function About() {
  const { t, lang } = useLang();

  return (
    <>
      {/* About */}
      <section id="about" className="about-section">
        <div className="section-inner">
          <div className="section-label fade-up">{t.s1label}</div>
          <div className="about-grid">
            <div className="about-text fade-up">
              <h2 className="section-title">{t.s1title}</h2>
              <p>{t.s1p1}</p>
              <p>{t.s1p2}</p>
              <p>{t.s1p3}</p>
            </div>
            <div className="fade-up">
              <SkillGroups />
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Experience */}
      <section id="experience" className="exp-section">
        <div className="section-inner">
          <div className="section-label fade-up">{t.expTitle}</div>
          <h2 className="section-title fade-up">{t.expTitle}</h2>
          <div className="timeline">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="timeline-item fade-up">
                <div className="timeline-dot" />
                <div className="exp-card">
                  <div className="exp-meta">
                    <div>
                      <div className="exp-company">{exp.company}</div>
                      <div className="exp-role">{exp.role[lang]}</div>
                    </div>
                    <div className="exp-period">
                      {exp.period === null ? t.expPresent : exp.period} · {exp.loc[lang]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
