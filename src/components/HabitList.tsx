import { FormEvent, useState } from 'react'
import type { Habit } from '../types'
import styles from './HabitList.module.css'

interface Props {
  habits: Habit[]
  checked: Record<string, boolean>
  completionRate: number
  toggleHabit: (id: string) => Promise<void>
  addHabit: (name: string) => Promise<void>
  loading: boolean
}

export function HabitList({ habits, checked, completionRate, toggleHabit, addHabit, loading }: Props) {
  const [draft, setDraft] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    await addHabit(draft)
    setDraft('')
  }

  const done  = habits.filter(h => checked[h.id]).length
  const total = habits.length

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Habits</span>
        {total > 0 && (
          <span className={styles.score}>
            {done}/{total}
            <span className={styles.bar}>
              <span className={styles.fill} style={{ width: `${completionRate * 100}%` }} />
            </span>
          </span>
        )}
      </div>

      <div className={styles.list}>
        {loading && <p className={styles.empty}>Loading…</p>}
        {!loading && habits.length === 0 && (
          <p className={styles.empty}>No habits yet — add one below</p>
        )}
        {habits.map(h => (
          <label key={h.id} className={styles.item}>
            <button
              className={`${styles.checkbox} ${checked[h.id] ? styles.checked : ''}`}
              onClick={() => toggleHabit(h.id)}
              aria-label={checked[h.id] ? 'Uncheck' : 'Check'}
            >
              {checked[h.id] && <CheckMark />}
            </button>
            <span className={`${styles.habitName} ${checked[h.id] ? styles.done : ''}`}>
              {h.name}
            </span>
          </label>
        ))}
      </div>

      <form className={styles.addForm} onSubmit={submit}>
        <input
          className={styles.addInput}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Add habit…"
        />
      </form>
    </div>
  )
}

function CheckMark() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
