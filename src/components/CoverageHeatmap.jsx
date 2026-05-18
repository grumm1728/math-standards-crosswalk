import { DOMAINS } from '../data/mockData'

function coverageColor(score) {
  if (score === undefined || score === null) return '#f3f4f6'
  if (score >= 0.90) return '#bbf7d0' // green
  if (score >= 0.75) return '#fef08a' // yellow
  if (score >= 0.50) return '#fed7aa' // orange
  return '#fecaca'                    // red
}

function coverageLabel(score) {
  if (score === undefined || score === null) return '—'
  return `${Math.round(score * 100)}%`
}

export default function CoverageHeatmap({ grade, states, coverage, onCellClick, selectedCell }) {
  const domainsAtGrade = DOMAINS.filter(d => d.grades.includes(grade))

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%' }}>
        <thead>
          <tr>
            <th style={th({ textAlign: 'left', minWidth: 200 })}>Domain</th>
            {states.map(s => (
              <th key={s.code} style={th({ textAlign: 'center', minWidth: 90 })}>
                <div style={{ fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontWeight: 400, color: '#6b7280', fontSize: 11 }}>{s.framework}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {domainsAtGrade.map(domain => (
            <tr key={domain.code}>
              <td style={td({ fontWeight: 500 })}>
                <span style={{ fontSize: 11, color: '#6b7280', marginRight: 6 }}>{domain.code}</span>
                {domain.name}
              </td>
              {states.map(s => {
                const score = coverage[s.code]?.[grade]?.[domain.code]
                const isSelected = selectedCell?.state === s.code && selectedCell?.domain === domain.code
                return (
                  <td
                    key={s.code}
                    onClick={() => score !== undefined && onCellClick({ state: s.code, domain: domain.code, grade, score })}
                    style={{
                      ...td({ textAlign: 'center' }),
                      background: coverageColor(score),
                      cursor: score !== undefined ? 'pointer' : 'default',
                      outline: isSelected ? '2px solid #2563eb' : 'none',
                      outlineOffset: -2,
                      fontWeight: isSelected ? 700 : 400,
                    }}
                  >
                    {coverageLabel(score)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 12, color: '#6b7280' }}>
        {[
          { color: '#bbf7d0', label: '≥90% aligned' },
          { color: '#fef08a', label: '75–89%' },
          { color: '#fed7aa', label: '50–74%' },
          { color: '#fecaca', label: '<50%' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: color, display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

const th = (extra = {}) => ({
  padding: '8px 12px',
  borderBottom: '2px solid #e5e7eb',
  ...extra,
})

const td = (extra = {}) => ({
  padding: '8px 12px',
  borderBottom: '1px solid #f3f4f6',
  ...extra,
})
