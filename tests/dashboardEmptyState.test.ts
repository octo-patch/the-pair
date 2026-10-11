import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const dashboard = await readFile(
  new URL('../src/renderer/src/components/Dashboard.tsx', import.meta.url),
  'utf8'
)

const appShell = await readFile(
  new URL('../src/renderer/src/components/AppShell.tsx', import.meta.url),
  'utf8'
)

const pairsHub = await readFile(
  new URL('../src/renderer/src/components/PairsHub.tsx', import.meta.url),
  'utf8'
)

const shellViews = await readFile(
  new URL('../src/renderer/src/components/ShellViews.tsx', import.meta.url),
  'utf8'
)

const enLocale = await readFile(
  new URL('../src/renderer/src/locales/en.json', import.meta.url),
  'utf8'
)

test('Dashboard is the pair detail view: console plus operations inspector', () => {
  assert.match(dashboard, /<PairConsole/)
  assert.match(dashboard, /<PairOperationsPanel/)
})

test('Dashboard holds no pair list — selection lives in the shell hub', () => {
  assert.doesNotMatch(dashboard, /<PairListSection/)
  assert.doesNotMatch(dashboard, /DashboardEmptyState/)
})

test('AppShell owns the section rail and running-pair badge', () => {
  assert.match(appShell, /export function AppShell\(/)
  assert.match(appShell, /shell-nav-\$\{key\}/)
  assert.match(appShell, /shell-nav-running-badge/)
  assert.match(appShell, /aria-current/)
})

test('PairsHub renders workspace-grouped pair cards with quick actions', () => {
  assert.match(pairsHub, /export function PairsHub\(/)
  assert.match(pairsHub, /buildWorkspaceGroups/)
  assert.match(pairsHub, /hub-pair-card-/)
  assert.match(pairsHub, /hub-new-pair/)
  assert.match(pairsHub, /onPausePair/)
  assert.match(pairsHub, /onResumePair/)
  assert.match(pairsHub, /onDeletePair/)
})

test('PairsHub owns the create-pair call to action in the pairs area', () => {
  assert.match(pairsHub, /onCreatePair/)
  assert.match(pairsHub, /quickActions\.create/)
  assert.match(pairsHub, /hub-empty-create/)
})

test('ShellViews mounts the activity and insights panels', () => {
  assert.match(shellViews, /export function ActivityView\(/)
  assert.match(shellViews, /export function InsightsView\(/)
  assert.match(shellViews, /<RecentActivityPanel/)
  assert.match(shellViews, /<InsightsPanel/)
})

test('shell navigation labels are localized', () => {
  const locale = JSON.parse(enLocale)

  assert.equal(typeof locale.shell.pairs, 'string')
  assert.equal(typeof locale.shell.activity, 'string')
  assert.equal(typeof locale.shell.insights, 'string')
  assert.equal(typeof locale.hub.title, 'string')
  assert.equal(typeof locale.hub.subtitle, 'string')
})

test('empty state has a real localized description', () => {
  const locale = JSON.parse(enLocale)

  assert.equal(typeof locale.emptyState.description, 'string')
  assert.match(locale.emptyState.description, /mentor/i)
  assert.match(locale.emptyState.description, /executor/i)
})
