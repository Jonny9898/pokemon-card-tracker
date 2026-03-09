import { useState, useRef, useEffect } from 'react'

export default function InlineEdit({ value, onSave, className, style }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.select()
    }
  }, [editing])

  useEffect(() => {
    setDraft(value)
  }, [value])

  if (!editing) {
    return (
      <span
        className={className}
        style={{ cursor: 'pointer', ...style }}
        onDoubleClick={() => {
          setDraft(value)
          setEditing(true)
        }}
        title="Double-click to edit"
      >
        {value}
      </span>
    )
  }

  const save = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== value) {
      onSave(trimmed)
    }
    setEditing(false)
  }

  return (
    <input
      ref={inputRef}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') save()
        if (e.key === 'Escape') {
          setDraft(value)
          setEditing(false)
        }
      }}
      onBlur={save}
      autoFocus
      style={{
        font: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        color: 'inherit',
        background: 'var(--bg-primary)',
        border: '1px solid var(--accent)',
        borderRadius: 'var(--radius-sm)',
        padding: '1px 4px',
        outline: 'none',
        width: '100%',
        minWidth: '0',
        ...style,
      }}
    />
  )
}
