'use client'

import { useState, useEffect, useCallback } from 'react'
import LandingPage from '@/components/LandingPage'
import LoginPage from '@/components/LoginPage'
import CotizadorPage from '@/components/CotizadorPage'
import AdminPage from '@/components/AdminPage'
import WhatsAppButton from '@/components/WhatsAppButton'

type View = 'landing' | 'login' | 'cotizador' | 'admin'

interface UserData {
  id: string
  username: string
  role: string
}

export default function Home() {
  const [view, setView] = useState<View>('landing')
  const [user, setUser] = useState<UserData | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    } catch {
      // not authenticated
    } finally {
      setAuthChecked(true)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Guard: redirect to login if accessing protected views without auth
  useEffect(() => {
    if (!authChecked) return
    if ((view === 'cotizador' || view === 'admin') && !user) {
      setView('login')
    }
    if (view === 'admin' && user && user.role !== 'admin') {
      setView('cotizador')
    }
  }, [view, user, authChecked])

  const handleLogin = (userData: UserData) => {
    setUser(userData)
    setView('cotizador')
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // silent
    }
    setUser(null)
    setView('landing')
  }

  const handleGoLogin = () => {
    if (user) {
      setView('cotizador')
    } else {
      setView('login')
    }
  }

  const handleGoCotizador = () => setView('cotizador')
  const handleGoLanding = () => setView('landing')

  // Landing page renders immediately (server-side), no loading gate
  if (view === 'landing') {
    return (
      <>
        <LandingPage onGoLogin={handleGoLogin} />
        <WhatsAppButton />
      </>
    )
  }

  // Auth-gated views: wait for auth check before rendering
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dona-cream">
        <div className="animate-pulse text-dona-gold text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <>
      {view === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onBack={() => setView('landing')}
        />
      )}
      {view === 'cotizador' && user && (
        <CotizadorPage
          user={user}
          onLogout={handleLogout}
          onGoAdmin={() => setView('admin')}
          onGoLanding={handleGoLanding}
        />
      )}
      {view === 'admin' && user && user.role === 'admin' && (
        <AdminPage
          user={user}
          onLogout={handleLogout}
          onGoCotizador={handleGoCotizador}
          onGoLanding={handleGoLanding}
        />
      )}
    </>
  )
}