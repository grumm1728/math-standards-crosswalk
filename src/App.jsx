function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '80px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        U.S. K–12 Math Standards Crosswalk
      </h1>
      <p style={{ color: '#555', fontSize: 16, marginBottom: 40 }}>
        Explore how state math standards align with the Common Core State Standards (CCSS)
        across grades and domains.
      </p>

      <div style={{ background: '#f4f4f5', borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Coming soon</h2>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#444', lineHeight: 2 }}>
          <li>Grade-level coverage heatmap across key states</li>
          <li>Texas TEKS · Florida BEST · Virginia SOLs · California · more</li>
          <li>Standard-level delta view — reuse, modify, or create from scratch</li>
          <li>Population-weighted alignment scores</li>
        </ul>
      </div>

      <p style={{ fontSize: 13, color: '#999' }}>
        Data synthesized from state DOE sources · Validated against published crosswalks
      </p>
    </div>
  )
}

export default App
