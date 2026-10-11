import React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'
import { GlassButton } from './ui/GlassButton'
import { TerminalDivider } from './terminal/TerminalDivider'
import type { PairRunSummary } from '../store/usePairStore'

interface TaskHistoryPanelProps {
  runHistory: PairRunSummary[]
  viewingRunId: string | null
  onSelectTask: (runId: string) => void
  onBackToCurrent: () => void
  onRestoreTask: (run: PairRunSummary) => void
  /** Disables restore while the pair is busy — restoring would kill the running run. */
  restoreDisabled?: boolean
  /** Rendered inside an InspectorSection; when set, skip the own header. */
  bare?: boolean
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function getDuration(startedAt: number, finishedAt?: number): string {
  const end = finishedAt ?? Date.now()
  const seconds = Math.floor((end - startedAt) / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
}

function HistoryList({
  runHistory,
  viewingRunId,
  onSelectTask,
  onBackToCurrent,
  onRestoreTask,
  restoreDisabled
}: Omit<TaskHistoryPanelProps, 'bare'>): React.ReactNode {
  const { t } = useTranslation()

  if (runHistory.length === 0) {
    return <p className="text-[10px] text-muted-foreground-faint pl-2">— {t('history.empty')} —</p>
  }

  const sorted = [...runHistory].reverse()

  return (
    <>
      {viewingRunId && (
        <div className="flex justify-end">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={onBackToCurrent}
            className="h-5 px-1.5 text-[9px]"
          >
            ← {t('history.backToCurrent')}
          </GlassButton>
        </div>
      )}
      <div className="shell-card overflow-hidden">
        <div className="max-h-[320px] overflow-y-auto scrollbar-thin">
          {sorted.map((run, idx) => {
            const isViewing = viewingRunId === run.id
            const duration = getDuration(run.startedAt, run.finishedAt)
            const modelShort = (model: string): string => model.split('/').pop() ?? model

            return (
              <div
                key={run.id}
                className={cn(
                  'group relative border-b border-border/40 last:border-b-0 transition-colors duration-150',
                  isViewing ? 'bg-foreground/[0.06]' : 'hover:bg-foreground/[0.04]'
                )}
              >
                <button
                  className="w-full text-left px-2 py-2 cursor-pointer"
                  onClick={() => onSelectTask(run.id)}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground-faint tabular-nums shrink-0">
                      #{runHistory.length - idx}
                    </span>
                    <span className="text-[9px] tabular-nums text-muted-foreground-faint shrink-0 mr-6">
                      {duration}
                    </span>
                  </div>
                  <p
                    className="text-[11px] leading-relaxed text-foreground/85 line-clamp-2 group-hover:line-clamp-3 transition-all mt-0.5"
                    title={run.spec}
                  >
                    {run.spec}
                  </p>
                  <div className="mt-1 flex items-baseline gap-2 text-[9px] text-muted-foreground-faint">
                    <span className="role-mentor">{modelShort(run.mentorModel)}</span>
                    <span className="text-muted-foreground-faint">/</span>
                    <span className="role-executor">{modelShort(run.executorModel)}</span>
                    {run.latestAcceptance?.verdict && (
                      <>
                        <span
                          className={cn(
                            'border px-1 py-px text-[8px] uppercase tracking-[0.14em]',
                            run.latestAcceptance.verdict.verdict === 'pass'
                              ? 'border-state-done bg-state-done state-done'
                              : 'border-state-running bg-state-running state-running'
                          )}
                        >
                          [{run.latestAcceptance.verdict.verdict}]
                        </span>
                        <span className="border border-border px-1 py-px text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                          {run.latestAcceptance.risk}
                        </span>
                      </>
                    )}
                    <span className="ml-auto">{formatDate(run.startedAt)}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (restoreDisabled) return
                    onRestoreTask(run)
                  }}
                  disabled={restoreDisabled}
                  aria-label={t('history.restoreTask')}
                  title={
                    restoreDisabled ? t('history.restoreDisabledBusy') : t('history.restoreTask')
                  }
                  data-testid="history-restore-btn"
                  className={cn(
                    'absolute right-1.5 top-1.5 p-1 text-muted-foreground rounded-sm transition-colors',
                    restoreDisabled
                      ? 'cursor-not-allowed opacity-30'
                      : cn(
                          'cursor-pointer hover:text-foreground hover:bg-foreground/[0.06]',
                          isViewing ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
                        )
                  )}
                >
                  <span aria-hidden className="text-[10px] leading-none">
                    ↺
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export function TaskHistoryPanel({
  runHistory,
  viewingRunId,
  onSelectTask,
  onBackToCurrent,
  onRestoreTask,
  restoreDisabled = false,
  bare = false
}: TaskHistoryPanelProps): React.ReactNode {
  const { t } = useTranslation()

  if (bare) {
    return (
      <HistoryList
        runHistory={runHistory}
        viewingRunId={viewingRunId}
        onSelectTask={onSelectTask}
        onBackToCurrent={onBackToCurrent}
        onRestoreTask={onRestoreTask}
        restoreDisabled={restoreDisabled}
      />
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <TerminalDivider label={t('history.title')} className="flex-1" />
      </div>
      <HistoryList
        runHistory={runHistory}
        viewingRunId={viewingRunId}
        onSelectTask={onSelectTask}
        onBackToCurrent={onBackToCurrent}
        onRestoreTask={onRestoreTask}
        restoreDisabled={restoreDisabled}
      />
    </div>
  )
}
