import { useEffect } from 'react'
import type { ShortcutDef } from '../lib/shortcuts'
import { matchesShortcut, isInputFocused, isCommandShortcut } from '../lib/shortcuts'

export function useShortcuts(shortcuts: ShortcutDef[]): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const inputFocused = isInputFocused(e)

      for (const shortcut of shortcuts) {
        // Inside a text field only command-modified shortcuts fire (Cmd+K,
        // Cmd+1…); bare keys are typing, not commands.
        if (inputFocused && !isCommandShortcut(e, shortcut)) continue
        if (matchesShortcut(e, shortcut)) {
          if (shortcut.condition && !shortcut.condition()) continue
          e.preventDefault()
          shortcut.handler()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
