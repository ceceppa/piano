import { useEffect, useState } from 'react'
import { chordName } from './musicCore'
import { useSelectionStore } from './store/useSelectionStore'
import Keyboard from './components/Keyboard'
import RootSelector from './components/root-selector'
import QualitySelector from './components/quality-selector'
import KeyModeSelector from './components/key-mode-selector'
import ScaleFollow from './components/scale-follow'
import ViewModeSelector from './components/view-mode-selector'
import GenreSelector from './components/genre-selector'
import PlaybackBar from './components/PlaybackBar'
import VariationPanel from './components/VariationPanel'
import Card from './components/shared/Card'
import Select from './components/shared/Select'
import ToggleSwitch from './components/shared/ToggleSwitch'
import './App.css'

function App() {
  const theme = useSelectionStore((s) => s.theme)
  const setTheme = useSelectionStore((s) => s.setTheme)
  const selection = useSelectionStore((s) => s.selection)
  const octaveStart = useSelectionStore((s) => s.octaveStart)
  const octaveEnd = useSelectionStore((s) => s.octaveEnd)
  const setOctaveRange = useSelectionStore((s) => s.setOctaveRange)
  const [showNoteNames, setShowNoteNames] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-titles">
          <h1>Piano Chord Explorer</h1>
          <p className="app-chord-name">{chordName(selection.root, selection.quality)}</p>
        </div>
        <ToggleSwitch
          label={theme === 'dark' ? 'Dark' : 'Light'}
          checked={theme === 'dark'}
          onChange={(dark) => setTheme(dark ? 'dark' : 'light')}
        />
      </header>
      <main className="explore" aria-label="Explore">
        <Card header="Musical context" className="controls-card">
          <RootSelector />
          <QualitySelector />
          <KeyModeSelector />
          <div className="controls-row">
            <ScaleFollow />
            <ViewModeSelector />
          </div>
          <div className="controls-row">
            <Select
              label="Keyboard range"
              value={`${octaveStart}-${octaveEnd}`}
              onChange={(e) => {
                const [start, end] = e.target.value.split('-').map(Number)
                setOctaveRange(start, end)
              }}
            >
              <option value="48-59">1 octave (C3–B3)</option>
              <option value="48-71">2 octaves (C3–B4)</option>
              <option value="48-83">3 octaves (C3–B5)</option>
              <option value="36-47">Lower octave (C2–B2)</option>
            </Select>
            <GenreSelector />
          </div>
          <ToggleSwitch
            label="Show note names"
            checked={showNoteNames}
            onChange={setShowNoteNames}
          />
        </Card>
        <Keyboard showNoteNames={showNoteNames} />
        <PlaybackBar />
        <VariationPanel />
      </main>
    </div>
  )
}

export default App
