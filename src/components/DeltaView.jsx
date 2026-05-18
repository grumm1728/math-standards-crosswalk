const LANE_META = {
  reuse:  { label: 'Reuse as-is',    color: '#bbf7d0', text: '#166534', desc: 'Coverage ≥90%, same grade' },
  modify: { label: 'Modify',         color: '#fef08a', text: '#854d0e', desc: 'Partial coverage or grade shift' },
  create: { label: 'Create new',     color: '#fecaca', text: '#991b1b', desc: 'No state equivalent' },
}

function LaneBadge({ lane }) {
  const m = LANE_META[lane]
  if (!m) return null
  return (
    <span style={{
      background: m.color,
      color: m.text,
      fontSize: 11,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 999,
    }}>
      {m.label}
    </span>
  )
}

export default function DeltaView({ state, grade, deltas }) {
  const lanes = ['reuse', 'modify', 'create']

  const counts = lanes.reduce((acc, l) => {
    acc[l] = deltas.filter(d => d.lane === l).length
    return acc
  }, {})

  const total = deltas.length

  return (
    <div>
      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {lanes.map(lane => {
          const m = LANE_META[lane]
          const pct = total ? Math.round((counts[lane] / total) * 100) : 0
          return (
            <div key={lane} style={{
              flex: 1,
              minWidth: 140,
              background: m.color,
              borderRadius: 8,
              padding: '12px 16px',
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: m.text }}>{pct}%</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: m.text }}>{m.label}</div>
              <div style={{ fontSize: 11, color: m.text, opacity: 0.8 }}>{counts[lane]} standards · {m.desc}</div>
            </div>
          )
        })}
      </div>

      {/* Standard-by-standard list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {deltas.map(d => (
          <div key={d.ccss_id} style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '12px 16px',
            background: '#fff',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#6b7280' }}>{d.ccss_id}</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                {d.grade_shift !== 0 && d.grade_shift !== null && (
                  <span style={{ fontSize: 11, color: '#6b7280' }}>
                    {d.grade_shift > 0 ? `+${d.grade_shift} grade` : `${d.grade_shift} grade`}
                  </span>
                )}
                <LaneBadge lane={d.lane} />
              </div>
            </div>
            <div style={{ fontSize: 14, color: '#111827', marginBottom: 6 }}>{d.ccss_desc}</div>
            {d.notes && (
              <div style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>
                {d.state_ids.length > 0
                  ? `→ ${d.state_ids.join(', ')}: `
                  : '→ No match: '}
                {d.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
