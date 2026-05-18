// ---------------------------------------------------------------------------
// Mock data — real data will be loaded from src/data/standards/ and
// src/data/crosswalks/ once research phase is complete.
// Shape here matches the final schema so components need no rewiring.
// ---------------------------------------------------------------------------

export const STATES = [
  { code: 'TX', name: 'Texas',      framework: 'TEKS',  enrollment: 5_400_000, ccssAdopted: false },
  { code: 'FL', name: 'Florida',    framework: 'BEST',  enrollment: 2_900_000, ccssAdopted: false },
  { code: 'VA', name: 'Virginia',   framework: 'SOLs',  enrollment: 1_260_000, ccssAdopted: false },
  { code: 'CA', name: 'California', framework: 'CA-CCSS', enrollment: 5_900_000, ccssAdopted: true  },
  { code: 'NY', name: 'New York',   framework: 'NYSLS', enrollment: 2_600_000, ccssAdopted: true  },
]

export const DOMAINS = [
  { code: 'OA',  name: 'Operations & Algebraic Thinking',     grades: [1,2,3,4,5] },
  { code: 'NBT', name: 'Number & Operations in Base Ten',     grades: [1,2,3,4,5] },
  { code: 'MD',  name: 'Measurement & Data',                  grades: [1,2,3,4,5] },
  { code: 'G',   name: 'Geometry',                            grades: [1,2,3,4,5,6] },
  { code: 'NF',  name: 'Number & Operations — Fractions',     grades: [3,4,5] },
  { code: 'RP',  name: 'Ratios & Proportional Relationships', grades: [6,7] },
  { code: 'NS',  name: 'The Number System',                   grades: [6,7,8] },
  { code: 'EE',  name: 'Expressions & Equations',             grades: [6,7,8] },
  { code: 'SP',  name: 'Statistics & Probability',            grades: [6,7,8] },
  { code: 'F',   name: 'Functions',                           grades: [8] },
]

// Coverage matrix: for each [state][grade][domain] → 0.0–1.0
// -1 = domain doesn't exist at that grade in CCSS (not applicable)
export const MOCK_COVERAGE = {
  TX: {
    2: { OA: 0.72, NBT: 0.88, MD: 0.65, G: 0.90 },
    3: { OA: 0.68, NBT: 0.80, MD: 0.70, G: 0.85, NF: 0.55 },
    4: { OA: 0.75, NBT: 0.78, MD: 0.60, G: 0.80, NF: 0.62 },
    5: { OA: 0.70, NBT: 0.82, MD: 0.58, G: 0.75, NF: 0.68 },
  },
  FL: {
    2: { OA: 0.82, NBT: 0.91, MD: 0.78, G: 0.88 },
    3: { OA: 0.80, NBT: 0.85, MD: 0.75, G: 0.90, NF: 0.70 },
    4: { OA: 0.85, NBT: 0.88, MD: 0.72, G: 0.85, NF: 0.75 },
    5: { OA: 0.82, NBT: 0.90, MD: 0.70, G: 0.80, NF: 0.78 },
  },
  VA: {
    2: { OA: 0.60, NBT: 0.75, MD: 0.55, G: 0.70 },
    3: { OA: 0.62, NBT: 0.72, MD: 0.60, G: 0.75, NF: 0.45 },
    4: { OA: 0.65, NBT: 0.70, MD: 0.58, G: 0.72, NF: 0.50 },
    5: { OA: 0.60, NBT: 0.75, MD: 0.55, G: 0.68, NF: 0.52 },
  },
  CA: {
    2: { OA: 0.95, NBT: 0.97, MD: 0.92, G: 0.96 },
    3: { OA: 0.93, NBT: 0.95, MD: 0.90, G: 0.94, NF: 0.92 },
    4: { OA: 0.94, NBT: 0.96, MD: 0.91, G: 0.95, NF: 0.93 },
    5: { OA: 0.93, NBT: 0.96, MD: 0.90, G: 0.94, NF: 0.92 },
  },
  NY: {
    2: { OA: 0.90, NBT: 0.93, MD: 0.88, G: 0.91 },
    3: { OA: 0.88, NBT: 0.91, MD: 0.86, G: 0.90, NF: 0.85 },
    4: { OA: 0.89, NBT: 0.92, MD: 0.87, G: 0.91, NF: 0.86 },
    5: { OA: 0.88, NBT: 0.91, MD: 0.86, G: 0.90, NF: 0.85 },
  },
}

// Grade 2 TX CCSS delta — drives the PM "reuse / modify / create" view
export const MOCK_DELTA_TX_G2 = [
  {
    ccss_id: 'CCSS.Math.Content.2.OA.A.1',
    ccss_desc: 'Use addition and subtraction within 100 to solve one- and two-step word problems.',
    state_ids: ['TX.TEKS.2.4C'],
    coverage: 0.70,
    alignment: 'partial',
    grade_shift: 0,
    lane: 'modify',
    notes: 'TEKS limits to one-step problems at grade 2; two-step problems move to grade 3.',
  },
  {
    ccss_id: 'CCSS.Math.Content.2.OA.B.2',
    ccss_desc: 'Fluently add and subtract within 20 using mental strategies.',
    state_ids: ['TX.TEKS.2.4A'],
    coverage: 0.95,
    alignment: 'full',
    grade_shift: 0,
    lane: 'reuse',
    notes: 'Near-identical. TEKS specifies "automaticity" wording.',
  },
  {
    ccss_id: 'CCSS.Math.Content.2.OA.C.3',
    ccss_desc: 'Determine whether a group of objects has an odd or even number.',
    state_ids: [],
    coverage: 0,
    alignment: 'absent',
    grade_shift: null,
    lane: 'create',
    notes: 'No TEKS equivalent at grade 2. Concept introduced informally in grade 3.',
  },
  {
    ccss_id: 'CCSS.Math.Content.2.NBT.A.1',
    ccss_desc: 'Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones.',
    state_ids: ['TX.TEKS.2.2A'],
    coverage: 0.90,
    alignment: 'full',
    grade_shift: 0,
    lane: 'reuse',
    notes: 'Strong alignment. TEKS extends to 1,200 vs CCSS 1,000.',
  },
  {
    ccss_id: 'CCSS.Math.Content.2.MD.A.1',
    ccss_desc: 'Measure the length of an object by selecting and using appropriate tools.',
    state_ids: ['TX.TEKS.2.9A', 'TX.TEKS.2.9B'],
    coverage: 0.80,
    alignment: 'partial',
    grade_shift: 0,
    lane: 'modify',
    notes: 'TEKS splits into two SEs and adds explicit estimation requirement.',
  },
]
