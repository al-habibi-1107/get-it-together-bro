import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true })
  }, [user, loading, navigate])

  async function handleGoogle() {
    setError('')
    setBusy(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      setError(parseError(e))
      setBusy(false)
    }
  }

  async function handleEmail(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signInWithEmail(email, password)
    } catch (e) {
      setError(parseError(e))
      setBusy(false)
    }
  }

  if (loading) return null

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.overline}>Personal Command Centre</p>
          <h1 className={styles.wordmark}>MERIDIAN</h1>
          <div className={styles.rule}>
            <div className={styles.ruleSweep} />
          </div>
        </div>

        <div className={styles.body}>
          <button
            className={styles.googleBtn}
            onClick={handleGoogle}
            disabled={busy}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <form className={styles.form} onSubmit={handleEmail}>
            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={busy}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Password</span>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={busy}
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.submitBtn} type="submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Corner bracket decorations */}
        <span className={`${styles.corner} ${styles.tl}`} />
        <span className={`${styles.corner} ${styles.tr}`} />
        <span className={`${styles.corner} ${styles.bl}`} />
        <span className={`${styles.corner} ${styles.br}`} />
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.8-2.7.8-2.08 0-3.84-1.4-4.47-3.29H1.83v2.07A8 8 0 0 0 8.98 17z"/>
      <path fill="#FBBC05" d="M4.51 10.56A4.83 4.83 0 0 1 4.26 9c0-.54.1-1.06.25-1.56V5.37H1.83A8 8 0 0 0 .98 9c0 1.29.31 2.51.85 3.63l2.68-2.07z"/>
      <path fill="#EA4335" d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 8.98 1a8 8 0 0 0-7.15 4.37l2.68 2.07c.63-1.89 2.39-3.86 4.47-3.86z"/>
    </svg>
  )
}

function parseError(e: unknown): string {
  if (!(e instanceof Error)) return 'Something went wrong.'
  const msg = e.message
  if (msg.includes('popup-closed-by-user')) return ''
  if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
    return 'Invalid email or password.'
  }
  if (msg.includes('too-many-requests')) return 'Too many attempts. Try again later.'
  return 'Something went wrong. Try again.'
}
