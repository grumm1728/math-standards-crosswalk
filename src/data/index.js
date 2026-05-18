import ccssGrade2 from './standards/ccss-grade2.json'
import txState from './states/TX.json'
import txGrade2Crosswalk from './crosswalks/TX-grade2.json'

// ---------------------------------------------------------------------------
// State registry — add new state files here as they are built
// ---------------------------------------------------------------------------
export const STATE_REGISTRY = [
  { code: 'TX', name: 'Texas',      framework: 'TEKS',    enrollment: 5_400_000, ccssAdopted: false, hasData: true  },
  { code: 'FL', name: 'Florida',    framework: 'BEST',    enrollment: 2_900_000, ccssAdopted: false, hasData: false },
  { code: 'VA', name: 'Virginia',   framework: 'SOLs',    enrollment: 1_260_000, ccssAdopted: false, hasData: false },
  { code: 'CA', name: 'California', framework: 'CA-CCSS', enrollment: 5_900_000, ccssAdopted: true,  hasData: false },
  { code: 'NY', name: 'New York',   framework: 'NYSLS',   enrollment: 2_600_000, ccssAdopted: true,  hasData: false },
]

// ---------------------------------------------------------------------------
// CCSS standards — indexed by grade, then domain for fast lookup
// ---------------------------------------------------------------------------
export const CCSS_STANDARDS = {
  2: ccssGrade2.standards,
}

export function getCCSSByGradeAndDomain(grade, domainCode) {
  return (CCSS_STANDARDS[grade] ?? []).filter(s => s.domain_code === domainCode)
}

export function getCCSSDomainsForGrade(grade) {
  const standards = CCSS_STANDARDS[grade] ?? []
  const seen = new Set()
  return standards
    .filter(s => { if (seen.has(s.domain_code)) return false; seen.add(s.domain_code); return true })
    .map(s => ({ code: s.domain_code, name: s.domain_name }))
}

// ---------------------------------------------------------------------------
// State standards
// ---------------------------------------------------------------------------
export const STATE_STANDARDS = { TX: txState }

// ---------------------------------------------------------------------------
// Crosswalks — indexed by state then grade
// ---------------------------------------------------------------------------
const CROSSWALKS = {
  TX: { 2: txGrade2Crosswalk },
}

export function getCrosswalk(stateCode, grade) {
  return CROSSWALKS[stateCode]?.[grade] ?? null
}

// ---------------------------------------------------------------------------
// Domain coverage score for a state at a grade level
// Derived from crosswalk mappings — average coverage_score per domain
// ---------------------------------------------------------------------------
export function getDomainCoverage(stateCode, grade) {
  const crosswalk = getCrosswalk(stateCode, grade)
  if (!crosswalk) return null

  const standards = CCSS_STANDARDS[grade] ?? []
  const byDomain = {}

  for (const std of standards) {
    const domain = std.domain_code
    if (!byDomain[domain]) byDomain[domain] = { total: 0, count: 0 }
    const mapping = crosswalk.mappings.find(m => m.ccss_id === std.id)
    byDomain[domain].total += mapping ? mapping.coverage_score : 0
    byDomain[domain].count += 1
  }

  const result = {}
  for (const [domain, { total, count }] of Object.entries(byDomain)) {
    result[domain] = count > 0 ? Math.round((total / count) * 100) / 100 : null
  }
  return result
}

// ---------------------------------------------------------------------------
// Delta view data (PM user story: reuse / modify / create lanes)
// ---------------------------------------------------------------------------
export function getDeltaForState(stateCode, grade) {
  const crosswalk = getCrosswalk(stateCode, grade)
  if (!crosswalk) return { mappings: [], teksOnly: [] }
  return {
    mappings: crosswalk.mappings,
    teksOnly: crosswalk.teks_only ?? [],
    domainSummary: crosswalk.domain_summary ?? {},
  }
}
