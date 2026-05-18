const GRADES = [
  { label: 'K', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: 'HS', value: 9 },
]

export default function GradeSelector({ selected, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {GRADES.map(g => (
        <button
          key={g.value}
          onClick={() => onChange(g.value)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            border: selected === g.value ? '2px solid #2563eb' : '1.5px solid #d1d5db',
            background: selected === g.value ? '#eff6ff' : '#fff',
            color: selected === g.value ? '#2563eb' : '#374151',
            fontWeight: selected === g.value ? 700 : 400,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
        >
          {g.label}
        </button>
      ))}
    </div>
  )
}
