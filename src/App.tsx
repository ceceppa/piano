import { useEffect } from 'react'
import { useSelectionStore } from './store/useSelectionStore'
import Keyboard from './components/Keyboard'
import SelectionSummary from './components/SelectionSummary'
import UnderstandSection from './components/UnderstandSection'
import Legend from './components/Legend'
import RootSelector from './components/root-selector'
import InversionSelector from './components/inversion-selector'
import ViewModeSelector from './components/view-mode-selector'
import PlaybackBar from './components/PlaybackBar'
import ChordTypeExplorer from './components/ChordTypeExplorer'
import ScaleTypeExplorer from './components/ScaleTypeExplorer'
import ToggleSwitch from './components/shared/ToggleSwitch'
import './App.css'

function App() {
  const theme = useSelectionStore((s) => s.theme)
  const setTheme = useSelectionStore((s) => s.setTheme)
  const selection = useSelectionStore((s) => s.selection)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const showChord = selection.viewMode !== 'scale'
  const showScale = selection.viewMode !== 'chord'

  return (
    <div className="app">
      <header className="app-header">
        <h1>Piano Chord Explorer</h1>
        <ToggleSwitch
          label={theme === 'dark' ? 'Dark' : 'Light'}
          checked={theme === 'dark'}
          onChange={(dark) => setTheme(dark ? 'dark' : 'light')}
        />
      </header>
      <main className="explore" aria-label="Explore">
        {/* Primary selection row — one tier: what to show, which root, which
            inversion (design-brief §Screen Composition, phase-5 item 2). */}
        <div className="controls-primary">
          <ViewModeSelector />
          <RootSelector />
          {showChord && <InversionSelector />}
        </div>
        <SelectionSummary aside={<Legend />} />
        <Keyboard />
        <PlaybackBar />
        <UnderstandSection />
        {/* Both view stacks both lists below the piano, chord types first. */}
        {showChord && <ChordTypeExplorer />}
        {showScale && <ScaleTypeExplorer />}
      </main>
    </div>
  )
}

export default App
