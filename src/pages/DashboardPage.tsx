import { useAuth } from '../contexts/AuthContext'
import { useTasks } from '../hooks/useTasks'
import { useHabits } from '../hooks/useHabits'
import { useStreakData } from '../hooks/useStreakData'
import { TaskMatrix } from '../components/TaskMatrix'
import { HabitList } from '../components/HabitList'
import { StreakGraph } from '../components/StreakGraph'
import { AISummary } from '../components/AISummary'
import styles from './DashboardPage.module.css'

function formatDate() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function DashboardPage() {
  const { signOut } = useAuth()
  const tasks  = useTasks()
  const habits = useHabits()
  const streakData = useStreakData()

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.wordmark}>MERIDIAN</span>
        <span className={styles.date}>{formatDate()}</span>
        <button className={styles.signOut} onClick={signOut}>Sign out</button>
      </header>

      <div className={styles.main}>
        <section className={styles.matrixWrap}>
          <TaskMatrix
            tasks={tasks.tasks}
            addTask={tasks.addTask}
            toggleTask={tasks.toggleTask}
            deleteTask={tasks.deleteTask}
            moveTask={tasks.moveTask}
          />
        </section>

        <aside className={styles.sidebar}>
          <HabitList
            habits={habits.habits}
            checked={habits.checked}
            completionRate={habits.completionRate}
            toggleHabit={habits.toggleHabit}
            addHabit={habits.addHabit}
            loading={habits.loading}
          />
          <StreakGraph data={streakData} todayScore={habits.completionRate} />
          <AISummary
            tasks={tasks.tasks}
            habits={habits.habits}
            checked={habits.checked}
          />
        </aside>
      </div>
    </div>
  )
}
