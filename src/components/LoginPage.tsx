'use client'

import { useState } from 'react'
import Image from 'next/image'
import LogoWrapper from '@/components/LogoWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LoginPageProps {
  onLogin: (user: { id: string; username: string; role: string }) => void
  onBack: () => void
}

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
        return
      }

      toast({ title: 'Bienvenido', description: `Hola, ${data.username}` })
      onLogin(data)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dona-cream px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-4 mb-8">
            <LogoWrapper size={80} variant="none" />
            <h1 className="text-2xl font-bold text-dona-black">
              Acceso al Cotizador
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dona-black mb-1">
                Usuario
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                required
                className="bg-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dona-black mb-1">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
                className="bg-white"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-dona-gold hover:bg-dona-gold/90 text-white font-semibold"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <button
            onClick={onBack}
            className="mt-6 mx-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-dona-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </button>
        </CardContent>
      </Card>
    </div>
  )
}