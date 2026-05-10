import styles from './StreakGraph.module.css'

interface Props {
  data: Map<string, number>
  todayScore: number
}

function buildWeeks(): string[][] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // go back to the Monday 52 weeks ago
  const start = new Date(today)
  start.setDate(start.getDate() - 363)
  const dow = start.getDay()
  start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1))

  const weeks: string[][] = []
  const cur = new Date(start)
  while (cur <= today) {
    const week: string[] = []
    for (let d = 0; d < 7; d++) {
      week.push(cur.toISOString().slice(0, 10))
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

const WEEKS = buildWeeks()
const TODAY = new Date().toISOString().slice(0, 10)
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function StreakGraph({ data, todayScore }: Props) {
  function scoreFor(date: string): number {
    if (date === TODAY) return todayScore
    return data.get(date) ?? -1 // -1 = future / no data
  }

  function cellColor(score: number): string {
    if (score < 0) return 'rgba(255,255,255,0.04)'
    if (score === 0) return 'rgba(255,255,255,0.04)'
    const alpha = 0.15 + score * 0.85
    return `rgba(201, 146, 42, ${alpha.toFixed(2)})`
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Consistency</span>
        <span className={styles.sub}>52 weeks</span>
      </div>
      <div className={styles.graphWrap}>
        <div className={styles.dayLabels}>
          {DAY_LABELS.map((l, i) => (
            <span key={i} className={styles.dayLabel}>{l}</span>
          ))}
        </div>
        <div className={styles.weeks}>
          {WEEKS.map((week, wi) => (
            <div key={wi} className={styles.week}>
              {week.map(date => {
                const score = scoreFor(date)
                const isFuture = date > TODAY
                return (
                  <div
                    key={date}
                    className={`${styles.cell} ${isFuture ? styles.future : ''} ${date === TODAY ? styles.today : ''}`}
                    style={{ background: isFuture ? 'transparent' : cellColor(score) }}
                    title={`${date}${score >= 0 ? ` · ${Math.round(score * 100)}%` : ''}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
