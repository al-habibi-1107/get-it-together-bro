import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import type { DailyLog } from '../types'

export function useStreakData() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'users', user.uid, 'dailyLog'),
      orderBy('date', 'desc'),
      limit(365),
    )
    return onSnapshot(q, snap => {
      const map = new Map<string, number>()
      snap.docs.forEach(d => {
        const data = d.data() as DailyLog
        map.set(data.date, data.completionScore ?? 0)
      })
      setLogs(map)
    })
  }, [user])

  return logs
}
