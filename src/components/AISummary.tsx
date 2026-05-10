import { useState } from 'react'
import type { Task, Habit } from '../types'
import styles from './AISummary.module.css'

interface Props {
  tasks: Task[]
  habits: Habit[]
  checked: Record<string, boolean>
}

export function AISummary({ tasks, habits, checked }: Props) {
  const [copied, setCopied] = useState(false)

  function buildExport(): string {
    const today = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    const q = (id: 'q1' | 'q2' | 'q3' | 'q4') =>
      tasks.filter(t => t.quadrant === id)

    function formatQ(id: 'q1' | 'q2' | 'q3' | 'q4', label: string) {
      const list = q(id)
      if (list.length === 0) return `## ${label}\n(empty)\n`
      return `## ${label}\n${list.map(t =>
        `- ${t.text}${t.status === 'completed' ? ' ✓' : ''}`
      ).join('\n')}\n`
    }

    const done  = habits.filter(h => checked[h.id]).length
    const total = habits.length
    const habitLines = habits.map(h =>
      `- ${h.name}: ${checked[h.id] ? '✓' : '✗'}`
    ).join('\n') || '(none)'

    return `# Meridian Daily State — ${today}

${formatQ('q1', 'Q1 (Do first)')}
${formatQ('q2', 'Q2 (Schedule)')}
${formatQ('q3', 'Q3 (Delegate)')}
${formatQ('q4', 'Q4 (Eliminate)')}
## Habits today (${done}/${total})
${habitLines}

Summarise my state, what I should focus on, and give me a short encouraging note.`
  }

  async function handleExport() {
    await navigator.clipboard.writeText(buildExport())
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>AI Summary</span>
        <span className={styles.phase}>Phase 2</span>
      </div>
      <div className={styles.body}>
        <p className={styles.hint}>
          Export your current state as a prompt, paste it into Claude, and get a daily briefing.
        </p>
        <button className={styles.exportBtn} onClick={handleExport}>
          {copied ? '✓ Copied to clipboard' : 'Export prompt'}
        </button>
      </div>
    </div>
  )
}
