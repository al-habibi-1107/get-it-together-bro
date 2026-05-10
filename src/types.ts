import type { Timestamp } from 'firebase/firestore'

export type Quadrant = 'q1' | 'q2' | 'q3' | 'q4'
export type TaskStatus = 'active' | 'completed' | 'archived'

export interface Task {
  id: string
  text: string
  quadrant: Quadrant
  status: TaskStatus
  createdAt: Timestamp
  completedAt: Timestamp | null
  updatedAt: Timestamp
}

export interface Habit {
  id: string
  name: string
  active: boolean
  createdAt: Timestamp
}

export interface DailyLog {
  date: string
  habitCompletions: Record<string, boolean>
  completionScore: number
}
