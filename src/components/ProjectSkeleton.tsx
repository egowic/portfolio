import type { CSSProperties } from 'react';

const pulseStyle: CSSProperties = {
  background: 'linear-gradient(90deg, #111114 25%, #18181c 50%, #111114 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-pulse 1.4s ease infinite',
  borderRadius: 4,
};

export default function ProjectSkeleton() {
  return (
    <>
      <style>{`
        @keyframes skeleton-pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          style={{ border: '1px solid #18181c', borderRadius: 8, padding: '28px 32px', background: '#0d0d10' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ ...pulseStyle, height: 10, width: 80, marginBottom: 10 }} />
              <div style={{ ...pulseStyle, height: 18, width: 160 }} />
            </div>
            <div style={{ ...pulseStyle, height: 10, width: 32 }} />
          </div>
          <div style={{ ...pulseStyle, height: 12, width: '100%', marginBottom: 8 }} />
          <div style={{ ...pulseStyle, height: 12, width: '80%', marginBottom: 20 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            {[60, 50, 70, 45].map((w, j) => (
              <div key={j} style={{ ...pulseStyle, height: 20, width: w }} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
