import { useEffect, useState } from 'react'
import {
  collection, query, where, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import type { Task, Quadrant, TaskStatus } from '../types'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'users', user.uid, 'tasks'),
      where('status', 'in', ['active', 'completed']),
    )
    return onSnapshot(q, snap => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as Task)))
      setLoading(false)
    })
  }, [user])

  async function addTask(text: string, quadrant: Quadrant) {
    if (!user || !text.trim()) return
    await addDoc(collection(db, 'users', user.uid, 'tasks'), {
      text: text.trim(),
      quadrant,
      status: 'active' as TaskStatus,
      createdAt: serverTimestamp(),
      completedAt: null,
      updatedAt: serverTimestamp(),
    })
  }

  async function toggleTask(task: Task) {
    if (!user) return
    const next: TaskStatus = task.status === 'active' ? 'completed' : 'active'
    await updateDoc(doc(db, 'users', user.uid, 'tasks', task.id), {
      status: next,
      completedAt: next === 'completed' ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    })
  }

  async function deleteTask(id: string) {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'tasks', id))
  }

  async function moveTask(id: string, quadrant: Quadrant) {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'tasks', id), {
      quadrant,
      updatedAt: serverTimestamp(),
    })
  }

  return { tasks, loading, addTask, toggleTask, deleteTask, moveTask }
}
