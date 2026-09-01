import { useEffect, useState } from 'react'
import { chordFullName, inversionName, slashChordLabel } from './musicCore'
import { useSelectionStore } from './store/useSelectionStore'
import Keyboard from './components/Keyboard'
import NotesPanel from './components/NotesPanel'
import RootSelector from './components/root-selector'
import QualitySelector from './components/quality-selector'
import InversionSelector from './components/inversion-selector'
import VoicingSelector from './components/voicing-selector'
import KeyModeSelector from './components/key-mode-selector'
import ScaleFollow from './components/scale-follow'
import ViewModeSelector from './components/view-mode-selector'
import GenreSelector from './components/genre-selector'
import PlaybackBar from './components/PlaybackBar'
import ChordTypeExplorer from './components/ChordTypeExplorer'
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
        <h1>Piano Chord Explorer</h1>
        <ToggleSwitch
          label={theme === 'dark' ? 'Dark' : 'Light'}
          checked={theme === 'dark'}
          onChange={(dark) => setTheme(dark ? 'dark' : 'light')}
        />
      </header>
      <h2 className="chord-title">
        {chordFullName(selection.root, selection.quality)}
        {selection.inversion !== 0 && (
          <>
            {' '}
            <span className="slash-label">
              {slashChordLabel({ root: selection.root, quality: selection.quality }, selection.inversion)}
            </span>{' '}
            <span className="inversion-name">{inversionName(selection.inversion)}</span>
          </>
        )}
      </h2>
      <main className="explore" aria-label="Explore">
        <div className="controls-dominant">
          <RootSelector />
          <QualitySelector />
          <InversionSelector />
          <VoicingSelector />
        </div>
        <Keyboard showNoteNames={showNoteNames} />
        <NotesPanel />
        <div className="controls-secondary">
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
        </div>
        <PlaybackBar />
        <ChordTypeExplorer />
      </main>
    </div>
  )
}

export default App
