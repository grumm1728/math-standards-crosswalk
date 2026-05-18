import { useState } from 'react'
import GradeSelector from './components/GradeSelector'
import CoverageHeatmap from './components/CoverageHeatmap'
import DeltaView from './components/DeltaView'
import { STATE_REGISTRY } from './data/index'

const VIEWS = { HEATMAP: 'heatmap', DELTA: 'delta' }

export default function App() {
  const [grade, setGrade] = useState(2)
  const [view, setView] = useState(VIEWS.HEATMAP)
  const [selectedCell, setSelectedCell] = useState(null)
  const [deltaState, setDeltaState] = useState('TX')

  function handleCellClick(cell) {
    setSelectedCell(cell)
    setDeltaState(cell.state)
    setView(VIEWS.DELTA)
  }

  const selectedStateMeta = STATE_REGISTRY.find(s => s.code === deltaState)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f9fafb' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>U.S. K–12 Math Standards Crosswalk</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
              How state math standards align with CCSS · Texas Grade 2 live · More states in progress
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 32px' }}>

        {/* Grade selector */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade</div>
          <GradeSelector selected={grade} onChange={g => { setGrade(g); setView(VIEWS.HEATMAP); setSelectedCell(null) }} />
        </div>

        {/* View tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <TabBtn active={view === VIEWS.HEATMAP} onClick={() => setView(VIEWS.HEATMAP)}>
            State Coverage Heatmap
          </TabBtn>
          <TabBtn active={view === VIEWS.DELTA} onClick={() => setView(VIEWS.DELTA)}>
            {selectedStateMeta
              ? `${selectedStateMeta.name} Grade ${grade === 0 ? 'K' : grade} Delta`
              : 'Delta View'}
          </TabBtn>
        </div>

        {/* Panel */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: 24 }}>

          {view === VIEWS.HEATMAP && (
            <>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>
                  Grade {grade === 0 ? 'K' : grade} — CCSS Domain Coverage by State
                </h2>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                  Scores show what fraction of each CCSS domain is covered in that state's standards. Click a cell to see the standard-level delta.
                </p>
              </div>
              <CoverageHeatmap
                grade={grade}
                states={STATE_REGISTRY}
                onCellClick={handleCellClick}
                selectedCell={selectedCell}
              />
            </>
          )}

          {view === VIEWS.DELTA && (
            <>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>
                    {selectedStateMeta?.name} ({selectedStateMeta?.framework}) vs. CCSS — Grade {grade === 0 ? 'K' : grade}
                  </h2>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    Curriculum planning view · {(selectedStateMeta?.enrollment ?? 0).toLocaleString()} enrolled students
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {STATE_REGISTRY.map(s => (
                    <button
                      key={s.code}
                      onClick={() => setDeltaState(s.code)}
                      disabled={!s.hasData}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: deltaState === s.code ? '2px solid #2563eb' : '1.5px solid #d1d5db',
                        background: deltaState === s.code ? '#eff6ff' : s.hasData ? '#fff' : '#f9fafb',
                        color: deltaState === s.code ? '#2563eb' : s.hasData ? '#374151' : '#d1d5db',
                        fontWeight: deltaState === s.code ? 700 : 400,
                        fontSize: 13,
                        cursor: s.hasData ? 'pointer' : 'not-allowed',
                      }}
                      title={s.hasData ? undefined : 'Crosswalk data coming soon'}
                    >
                      {s.code}
                    </button>
                  ))}
                </div>
              </div>
              <DeltaView stateCode={deltaState} grade={grade} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 6,
      border: active ? '2px solid #2563eb' : '1.5px solid #d1d5db',
      background: active ? '#2563eb' : '#fff',
      color: active ? '#fff' : '#374151',
      fontWeight: active ? 600 : 400,
      fontSize: 14, cursor: 'pointer',
    }}>
      {children}
    </button>
  )
}
