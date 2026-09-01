import { useEffect, useRef, useState } from 'react'
import Button from './shared/Button'
import VoicingSelector from './voicing-selector'
import './ChordOptions.css'

/**
 * Voicing and hand arrangement, one step deeper than the first selection
 * (design-brief §Chord options panel). They refine a chord that has already
 * been chosen, so they live behind a control in the playback row rather than
 * in the primary selection region. Closing the panel — by its own close
 * control, Escape, or a click outside — returns focus to the button that
 * opened it.
 */
export default function ChordOptions() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      close()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  return (
    <div className="chord-options">
      <Button
        ref={triggerRef}
        variant="ghost"
        className="chord-options-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        Chord options
      </Button>
      {open && (
        <div className="chord-options-panel" role="dialog" aria-label="Chord options" ref={panelRef}>
          <VoicingSelector />
          <Button variant="ghost" className="chord-options-close" onClick={close}>
            Done
          </Button>
        </div>
      )}
    </div>
  )
}
