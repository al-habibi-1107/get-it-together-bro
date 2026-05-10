import { FormEvent, useState } from 'react'
import type { Task, Quadrant } from '../types'
import styles from './TaskMatrix.module.css'

const META: Record<Quadrant, { label: string; sub: string; accent: string }> = {
  q1: { label: 'Do First',  sub: 'Urgent · Important',         accent: 'var(--q1)' },
  q2: { label: 'Schedule',  sub: 'Important · Not urgent',     accent: 'var(--q2)' },
  q3: { label: 'Delegate',  sub: 'Urgent · Not important',     accent: 'var(--q3)' },
  q4: { label: 'Eliminate', sub: 'Neither',                    accent: 'var(--q4)' },
}

const ALL_Q: Quadrant[] = ['q1', 'q2', 'q3', 'q4']

interface Props {
  tasks: Task[]
  addTask: (text: string, q: Quadrant) => Promise<void>
  toggleTask: (t: Task) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  moveTask: (id: string, q: Quadrant) => Promise<void>
}

export function TaskMatrix({ tasks, addTask, toggleTask, deleteTask, moveTask }: Props) {
  return (
    <div className={styles.grid}>
      {ALL_Q.map(q => (
        <QuadrantPanel
          key={q}
          quadrant={q}
          tasks={tasks.filter(t => t.quadrant === q)}
          onAdd={text => addTask(text, q)}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onMove={moveTask}
        />
      ))}
    </div>
  )
}

function QuadrantPanel({
  quadrant, tasks, onAdd, onToggle, onDelete, onMove,
}: {
  quadrant: Quadrant
  tasks: Task[]
  onAdd: (text: string) => Promise<void>
  onToggle: (t: Task) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onMove: (id: string, q: Quadrant) => Promise<void>
}) {
  const [draft, setDraft] = useState('')
  const meta = META[quadrant]

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    try {
      await onAdd(draft)
      setDraft('')
    } catch (err) {
      console.error('Failed to add task:', err)
    }
  }

  const active    = tasks.filter(t => t.status === 'active')
  const completed = tasks.filter(t => t.status === 'completed')

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader} style={{ '--accent': meta.accent } as React.CSSProperties}>
        <span className={styles.quadrantId}>{quadrant.toUpperCase()}</span>
        <span className={styles.quadrantLabel}>{meta.label}</span>
        <span className={styles.quadrantSub}>{meta.sub}</span>
      </div>

      <div className={styles.taskList}>
        {active.length === 0 && completed.length === 0 && (
          <p className={styles.empty}>No tasks</p>
        )}
        {active.map(t => (
          <TaskItem key={t.id} task={t} quadrant={quadrant}
            onToggle={onToggle} onDelete={onDelete} onMove={onMove} />
        ))}
        {completed.map(t => (
          <TaskItem key={t.id} task={t} quadrant={quadrant}
            onToggle={onToggle} onDelete={onDelete} onMove={onMove} />
        ))}
      </div>

      <form className={styles.addForm} onSubmit={submit}>
        <input
          className={styles.addInput}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Add task…"
        />
        <button type="submit" hidden />
      </form>
    </div>
  )
}

function TaskItem({ task, quadrant, onToggle, onDelete, onMove }: {
  task: Task
  quadrant: Quadrant
  onToggle: (t: Task) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onMove: (id: string, q: Quadrant) => Promise<void>
}) {
  const done = task.status === 'completed'
  return (
    <div className={`${styles.task} ${done ? styles.taskDone : ''}`}>
      <button
        className={styles.checkbox}
        onClick={() => onToggle(task)}
        aria-label={done ? 'Mark active' : 'Mark complete'}
      >
        {done ? <CheckIcon /> : <EmptyCheck />}
      </button>
      <span className={styles.taskText}>{task.text}</span>
      <div className={styles.actions}>
        {ALL_Q.filter(q => q !== quadrant).map(q => (
          <button key={q} className={styles.moveBtn} onClick={() => onMove(task.id, q)}>
            {q.toUpperCase()}
          </button>
        ))}
        <button className={styles.deleteBtn} onClick={() => onDelete(task.id)} aria-label="Delete">×</button>
      </div>
    </div>
  )
}

function EmptyCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="0.5" y="0.5" width="13" height="13" rx="2" stroke="currentColor" strokeOpacity="0.35"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="0.5" y="0.5" width="13" height="13" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeOpacity="0.6"/>
      <path d="M3.5 7l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
