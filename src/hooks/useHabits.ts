import { useEffect, useState } from 'react'
import {
  collection, doc, onSnapshot,
  addDoc, setDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import type { Habit } from '../types'

export function useHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsub1 = onSnapshot(collection(db, 'users', user.uid, 'habits'), snap => {
      setHabits(
        snap.docs
          .map(d => ({ id: d.id, ...d.data() } as Habit))
          .filter(h => h.active)
          .sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)),
      )
    })
    const unsub2 = onSnapshot(doc(db, 'users', user.uid, 'todayHabits', 'current'), snap => {
      setChecked((snap.data() as Record<string, boolean>) ?? {})
      setLoading(false)
    })
    return () => { unsub1(); unsub2() }
  }, [user])

  async function toggleHabit(habitId: string) {
    if (!user) return
    await setDoc(
      doc(db, 'users', user.uid, 'todayHabits', 'current'),
      { [habitId]: !checked[habitId] },
      { merge: true },
    )
  }

  async function addHabit(name: string) {
    if (!user || !name.trim()) return
    await addDoc(collection(db, 'users', user.uid, 'habits'), {
      name: name.trim(),
      active: true,
      createdAt: serverTimestamp(),
    })
  }

  const completionRate = habits.length === 0
    ? 0
    : habits.filter(h => checked[h.id]).length / habits.length

  return { habits, checked, loading, toggleHabit, addHabit, completionRate }
}
