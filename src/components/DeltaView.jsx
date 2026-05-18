import { getDeltaForState, getCCSSDomainsForGrade } from '../data/index'

const LANE_META = {
  reuse:  { label: 'Reuse as-is',  color: '#bbf7d0', text: '#166534', desc: 'Coverage ≥90%, same grade' },
  modify: { label: 'Modify',       color: '#fef08a', text: '#854d0e', desc: 'Partial coverage or scope difference' },
  create: { label: 'Create new',   color: '#fecaca', text: '#991b1b', desc: 'No state equivalent' },
}

const ALIGN_LABELS = {
  full:    { label: 'Full',    color: '#166534' },
  partial: { label: 'Partial', color: '#854d0e' },
  absent:  { label: 'Absent',  color: '#991b1b' },
  exceeds: { label: 'Exceeds CCSS', color: '#1d4ed8' },
}

function LaneBadge({ lane }) {
  const m = LANE_META[lane]
  return m ? (
    <span style={{ background: m.color, color: m.text, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>
      {m.label}
    </span>
  ) : null
}

function AlignBadge({ type }) {
  const m = ALIGN_LABELS[type]
  return m ? (
    <span style={{ fontSize: 11, color: m.color, fontWeight: 500 }}>{m.label}</span>
  ) : null
}

export default function DeltaView({ stateCode, grade }) {
  const { mappings, teksOnly, domainSummary } = getDeltaForState(stateCode, grade)

  if (!mappings.length) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>
        Crosswalk data for this state is coming soon.
      </div>
    )
  }

  const lanes = ['reuse', 'modify', 'create']
  const counts = lanes.reduce((acc, l) => { acc[l] = mappings.filter(m => m.lane === l).length; return acc }, {})
  const total = mappings.length

  // Group mappings by domain
  const domains = getCCSSDomainsForGrade(grade)
  const byDomain = domains.map(d => ({
    ...d,
    items: mappings.filter(m => m.ccss_id.includes(`.${d.code}.`)),
  })).filter(d => d.items.length > 0)

  return (
    <div>
      {/* Lane summary cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {lanes.map(lane => {
          const m = LANE_META[lane]
          const pct = total ? Math.round((counts[lane] / total) * 100) : 0
          return (
            <div key={lane} style={{ flex: 1, minWidth: 140, background: m.color, borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: m.text }}>{pct}%</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: m.text }}>{m.label}</div>
              <div style={{ fontSize: 11, color: m.text, opacity: 0.8 }}>{counts[lane]} of {total} standards</div>
            </div>
          )
        })}
        {teksOnly.length > 0 && (
          <div style={{ flex: 1, minWidth: 140, background: '#ede9fe', borderRadius: 8, padding: '12px 16px' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#4c1d95' }}>{teksOnly.length}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4c1d95' }}>TX-only topics</div>
            <div style={{ fontSize: 11, color: '#4c1d95', opacity: 0.8 }}>No CCSS equivalent</div>
          </div>
        )}
      </div>

      {/* Domain-grouped standards */}
      {byDomain.map(domain => (
        <div key={domain.code} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', borderBottom: '2px solid #e5e7eb', paddingBottom: 6, marginBottom: 10 }}>
            <span style={{ color: '#9ca3af', marginRight: 6 }}>{domain.code}</span>{domain.name}
            {domainSummary[domain.code] && (
              <span style={{ fontSize: 11, fontWeight: 400, color: '#6b7280', marginLeft: 8 }}>
                — {domainSummary[domain.code].note}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {domain.items.map(mapping => (
              <div key={mapping.ccss_id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#6b7280' }}>{mapping.ccss_id}</span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    <AlignBadge type={mapping.alignment_type} />
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{Math.round(mapping.coverage_score * 100)}%</span>
                    {mapping.grade_shift !== 0 && mapping.grade_shift !== null && (
                      <span style={{ fontSize: 11, color: '#6b7280', background: '#f3f4f6', padding: '1px 6px', borderRadius: 4 }}>
                        {mapping.grade_shift > 0 ? `+${mapping.grade_shift}yr` : `${mapping.grade_shift}yr`}
                      </span>
                    )}
                    <LaneBadge lane={mapping.lane} />
                  </div>
                </div>
                {mapping.state_standard_ids?.length > 0 && (
                  <div style={{ fontSize: 11, color: '#2563eb', marginBottom: 4, fontFamily: 'monospace' }}>
                    → {mapping.state_standard_ids.join(', ')}
                  </div>
                )}
                {mapping.notes && (
                  <div style={{ fontSize: 12, color: '#4b5563' }}>{mapping.notes}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* TX-only standards */}
      {teksOnly.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', borderBottom: '2px solid #ede9fe', paddingBottom: 6, marginBottom: 10 }}>
            Texas-Only Content (no CCSS equivalent)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {teksOnly.map((item, i) => (
              <div key={i} style={{ border: '1px solid #ede9fe', borderRadius: 8, padding: '10px 14px', background: '#faf5ff' }}>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#7c3aed', marginBottom: 4 }}>
                  {item.state_standard_ids.join(', ')}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#4c1d95', marginBottom: 4 }}>{item.topic}</div>
                <div style={{ fontSize: 12, color: '#4b5563' }}>{item.notes}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
