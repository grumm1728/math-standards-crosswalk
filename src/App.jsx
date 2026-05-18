import { useState } from 'react'
import GradeSelector from './components/GradeSelector'
import CoverageHeatmap from './components/CoverageHeatmap'
import DeltaView from './components/DeltaView'
import { STATES, MOCK_COVERAGE, MOCK_DELTA_TX_G2 } from './data/mockData'

const VIEWS = {
  HEATMAP: 'heatmap',
  DELTA: 'delta',
}

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

  const selectedStateMeta = STATES.find(s => s.code === deltaState)

  // In future this will load from real crosswalk JSON files
  const deltaData = MOCK_DELTA_TX_G2

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>U.S. K–12 Math Standards Crosswalk</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
              How state standards align with CCSS · <span style={{ color: '#f59e0b', fontWeight: 600 }}>⚠ Mock data</span> — real crosswalks in progress
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 32px' }}>

        {/* Grade selector */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade</div>
          <GradeSelector selected={grade} onChange={g => { setGrade(g); setView(VIEWS.HEATMAP) }} />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <TabBtn active={view === VIEWS.HEATMAP} onClick={() => setView(VIEWS.HEATMAP)}>
            State Coverage Heatmap
          </TabBtn>
          <TabBtn active={view === VIEWS.DELTA} onClick={() => setView(VIEWS.DELTA)}>
            {selectedStateMeta ? `${selectedStateMeta.name} Grade ${grade === 0 ? 'K' : grade} Delta` : 'Delta View'}
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
                  Click any cell to see the standard-level delta for that state.
                </p>
              </div>
              <CoverageHeatmap
                grade={grade}
                states={STATES}
                coverage={MOCK_COVERAGE}
                onCellClick={handleCellClick}
                selectedCell={selectedCell}
              />
            </>
          )}

          {view === VIEWS.DELTA && (
            <>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>
                    {selectedStateMeta?.name} ({selectedStateMeta?.framework}) vs. CCSS — Grade {grade === 0 ? 'K' : grade}
                  </h2>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    Curriculum content planning view · {(selectedStateMeta?.enrollment ?? 0).toLocaleString()} enrolled students
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {STATES.map(s => (
                    <button
                      key={s.code}
                      onClick={() => setDeltaState(s.code)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: deltaState === s.code ? '2px solid #2563eb' : '1.5px solid #d1d5db',
                        background: deltaState === s.code ? '#eff6ff' : '#fff',
                        color: deltaState === s.code ? '#2563eb' : '#374151',
                        fontWeight: deltaState === s.code ? 700 : 400,
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      {s.code}
                    </button>
                  ))}
                </div>
              </div>
              <DeltaView state={deltaState} grade={grade} deltas={deltaData} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 6,
        border: active ? '2px solid #2563eb' : '1.5px solid #d1d5db',
        background: active ? '#2563eb' : '#fff',
        color: active ? '#fff' : '#374151',
        fontWeight: active ? 600 : 400,
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}
