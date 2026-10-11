import { chromium } from '@playwright/test'
import { openApp } from '../e2e-web/fixtures/app.ts'

const SHOT_DIR = 'docs/assets'

const idle = (label: string) => ({
  phase: 'idle',
  label,
  startedAt: 1_000,
  updatedAt: 1_000,
  outputLineCount: 0
})

function msg(
  id: string,
  from: 'mentor' | 'executor' | 'human',
  type: 'plan' | 'result' | 'progress',
  content: string,
  iteration: number
) {
  return {
    id,
    timestamp: 1_000 + iteration * 60_000,
    from,
    to: from === 'human' ? 'both' : from === 'mentor' ? 'executor' : 'mentor',
    type,
    content,
    iteration,
    startedAt: 1_000,
    finalizedAt: 60_000
  }
}

const missionSpec = `ROLE: MENTOR. Analyze the task and provide a detailed PLAN for the EXECUTOR. DO NOT execute it yourself.

TASK: Add spam filtering to the contact form backend — reject submissions containing SEO or crypto keywords, case-insensitively, and return typed results.`

const mentorPlan = `Based on my analysis, here is the concrete PLAN for the EXECUTOR:

EXECUTABLE PLAN: 3-Step Spam Filter
Item 1: Keyword lists (SEO + crypto)
Status: Ready — implement as lowercase sets for O(1) lookup.

Item 2: Case-insensitive matching
Status: Normalize name + email + phone + message with toLowerCase() before checking.

Item 3: Typed results
Status: Return { success: false, error: "spam_detected", matchedKeywords } on hits, { success: true } otherwise.`

const executorResult = `Implementation complete. All requirements verified:

| Requirement | Status |
|---|---|
| SEO keyword filtering | 12 keywords covered |
| Crypto keyword filtering | 18 keywords covered |
| Case-insensitive matching | toLowerCase() applied |
| Combined field checking | name + email + phone + message |
| Early return on spam | Logs + returns { success: false } |
| Proper return typing | Promise<{ success: boolean; error?: string; matchedKeywords?: string[] }> |
| Email error handling | try/catch with error response |

Implementation is clean, follows the plan exactly, and meets all requirements.
TASK_COMPLETE`

const finishedPair = {
  pairId: 'pair-shot-review',
  name: 'contact-spam-filter',
  directory: '/repo/.worktrees/pair-shot-review',
  spec: 'Filter SEO and crypto spam keywords from the contact form backend',
  status: 'Finished',
  iterations: 3,
  maxIterations: 8,
  turn: 'executor',
  mentorModel: 'claude:opus',
  executorModel: 'codex:gpt-5',
  mentorProvider: 'claude',
  executorProvider: 'codex',
  messages: [
    msg('m0', 'human', 'progress', missionSpec, 0),
    msg('m1', 'mentor', 'plan', mentorPlan, 1),
    msg('m2', 'executor', 'result', executorResult, 2)
  ],
  mentorActivity: idle('Mentor idle'),
  executorActivity: idle('Executor idle'),
  mentorCpu: 0,
  mentorMemMb: 0,
  executorCpu: 4.2,
  executorMemMb: 177.8,
  cpuUsage: 4.2,
  memUsage: 177.8,
  modifiedFiles: [
    { path: 'src/utils/spamFilter.ts', status: 'A', displayPath: 'src/utils/spamFilter.ts' },
    {
      path: 'src/app/api/contact/route.ts',
      status: 'M',
      displayPath: 'src/app/api/contact/route.ts'
    },
    {
      path: 'src/components/Auth/SignIn/index.tsx',
      status: 'M',
      displayPath: 'src/components/Auth/SignIn/index.tsx'
    },
    {
      path: 'src/components/Auth/SignUp/index.tsx',
      status: 'M',
      displayPath: 'src/components/Auth/SignUp/index.tsx'
    }
  ],
  gitTracking: { available: true },
  automationMode: 'full-auto',
  runCount: 1,
  runHistory: [],
  currentRunStartedAt: 1_700_000_000_000,
  currentRunFinishedAt: 1_700_000_060_000,
  worktreeBranch: 'the-pair/contact-spam-filter',
  snapshotVersion: 1,
  savedAt: 1_000,
  providerSessions: {}
}

const runningPair = {
  ...finishedPair,
  pairId: 'pair-shot-running',
  name: 'rate-limit-middleware',
  directory: '/repo/.worktrees/pair-shot-running',
  spec: 'Add sliding-window rate limiting to the public API routes',
  status: 'Executing',
  worktreeBranch: 'the-pair/rate-limit-middleware',
  messages: [
    msg('r0', 'human', 'progress', missionSpec, 0),
    msg('r1', 'mentor', 'plan', mentorPlan, 1)
  ],
  executorActivity: {
    phase: 'executing',
    label: 'Writing rate-limit middleware',
    startedAt: 1_000,
    updatedAt: 2_000,
    outputLineCount: 42
  },
  currentTurnCard: {
    id: 'turn-1',
    role: 'executor',
    content: 'Scaffolding the sliding-window limiter with in-memory buckets…',
    updatedAt: 2_000,
    activity: {
      phase: 'executing',
      label: 'Writing rate-limit middleware',
      startedAt: 1_000,
      updatedAt: 2_000,
      outputLineCount: 42
    }
  }
}

async function main(): Promise<void> {
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1400, height: 1000 },
    deviceScaleFactor: 2,
    baseURL: 'http://127.0.0.1:5199'
  })

  // 1 — Pairs hub with two pairs.
  await openApp(page, { snapshots: [finishedPair, runningPair] })
  await page.getByTestId('pairs-hub').waitFor({ timeout: 15_000 })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${SHOT_DIR}/hub.png` })

  // 2 — Pair detail: finished review with inspector.
  await page.getByTestId('hub-pair-card-pair-shot-review').click()
  await page.getByTestId('chrome-branch-chip').waitFor({ timeout: 15_000 })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${SHOT_DIR}/pair-detail.png` })

  // 3 — Command palette open with a query.
  await page.keyboard.press('Meta+k')
  await page.getByTestId('command-palette').waitFor({ timeout: 10_000 })
  await page.getByTestId('command-palette-input').fill('pair')
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${SHOT_DIR}/palette.png` })
  await page.keyboard.press('Escape')

  // 4 — Running pair: live turn card in the stream.
  await page.getByTestId('chrome-back').click()
  await page.getByTestId('hub-pair-card-pair-shot-running').click()
  await page.getByTestId('chrome-branch-chip').waitFor({ timeout: 15_000 })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${SHOT_DIR}/pair-running.png` })

  await browser.close()
  console.log('screenshots written to', SHOT_DIR)
}

await main()
