import React, { lazy, Suspense } from 'react'
import { Pair } from '../store/usePairStore'

const PairConsole = lazy(() => import('./PairConsole'))
const PairOperationsPanel = lazy(() => import('./PairOperationsPanel'))

interface DashboardProps {
  selectedPair: Pair
  onPauseSelectedPair: () => Promise<void>
  onResumeSelectedPair: () => Promise<void>
  onRestoreTask: (spec: string, mentorModel: string, executorModel: string) => void
}

function ColumnFallback(): React.ReactNode {
  return <div className="h-full w-full bg-background" />
}

/**
 * Pair detail view: the conversation console plus the operations inspector.
 * Pair selection lives in the shell (Pairs hub); this component assumes a
 * selected pair and holds no list state.
 */
export function Dashboard({
  selectedPair,
  onPauseSelectedPair,
  onResumeSelectedPair,
  onRestoreTask
}: DashboardProps): React.ReactNode {
  return (
    <div className="relative h-full overflow-hidden bg-background">
      <div className="relative z-10 flex h-full overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Suspense fallback={<ColumnFallback />}>
            {/* Keyed by pair: drafts, attached file contents, filters and popovers
                are per-pair local state and must not carry over to another pair. */}
            <PairConsole key={selectedPair.id} pair={selectedPair} />
          </Suspense>
        </div>

        {/* Visible from lg up — the window's minWidth is 1200px, and this panel holds
            Retry, run history and the way back from an archived run. */}
        <div className="hidden w-[280px] shrink-0 lg:flex lg:flex-col xl:w-[320px]">
          <Suspense fallback={<ColumnFallback />}>
            <PairOperationsPanel
              key={selectedPair.id}
              pair={selectedPair}
              onPause={onPauseSelectedPair}
              onResume={onResumeSelectedPair}
              onRestoreTask={onRestoreTask}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
