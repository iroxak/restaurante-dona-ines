'use client'

import { useState, useEffect, useCallback } from 'react'
import LogoWrapper from '@/components/LogoWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  LogOut,
  Plus,
  Trash2,
  KeyRound,
  Users,
  FileText,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  username: string
  role: string
  createdAt: string
}

interface AdminPageProps {
  user: { id: string; username: string; role: string }
  onLogout: () => void
  onGoCotizador: () => void
  onGoLanding: () => void
}

export default function AdminPage({ user, onLogout, onGoCotizador, onGoLanding }: AdminPageProps) {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // Create user dialog
  const [showCreate, setShowCreate] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('user')
  const [creating, setCreating] = useState(false)

  // Change password dialog
  const [showPassword, setShowPassword] = useState(false)
  const [passwordUserId, setPasswordUserId] = useState('')
  const [passwordUsername, setPasswordUsername] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [changing, setChanging] = useState(false)

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const createUser = async () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      toast({ title: 'Error', description: 'Complete todos los campos', variant: 'destructive' })
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
      })
      if (res.ok) {
        toast({ title: 'Creado', description: `Usuario "${newUsername}" creado` })
        setShowCreate(false)
        setNewUsername('')
        setNewPassword('')
        setNewRole('user')
        await fetchUsers()
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudo crear', variant: 'destructive' })
    } finally {
      setCreating(false)
    }
  }

  const changePassword = async () => {
    if (!newUserPassword.trim()) {
      toast({ title: 'Error', description: 'Ingrese la nueva contraseña', variant: 'destructive' })
      return
    }
    setChanging(true)
    try {
      const res = await fetch(`/api/users/${passwordUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newUserPassword }),
      })
      if (res.ok) {
        toast({ title: 'Actualizada', description: `Contraseña de "${passwordUsername}" cambiada` })
        setShowPassword(false)
        setNewUserPassword('')
      } else {
        toast({ title: 'Error', description: 'No se pudo cambiar', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudo cambiar', variant: 'destructive' })
    } finally {
      setChanging(false)
    }
  }

  const deleteUser = async (id: string, username: string) => {
    if (!confirm(`¿Eliminar al usuario "${username}"?`)) return
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Eliminado', description: `Usuario "${username}" eliminado` })
        await fetchUsers()
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-dona-cream">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dona-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <LogoWrapper size={28} />
            <span className="text-dona-gold font-semibold text-sm hidden sm:block">
              Administración — Doña Inés
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm hidden sm:block">{user.username}</span>
            <Button variant="ghost" size="sm" onClick={onGoCotizador} className="text-white hover:text-dona-gold gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Cotizador</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onGoLanding} className="text-white hover:text-dona-gold gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Inicio</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:text-red-400 gap-1">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-dona-gold" />
                <CardTitle className="text-lg font-bold text-dona-black">Gestión de Usuarios</CardTitle>
              </div>
              <Button onClick={() => setShowCreate(true)} className="bg-dona-gold hover:bg-dona-gold/90 text-white gap-2">
                <Plus className="h-4 w-4" />
                Crear usuario
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Cargando...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.username}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={u.role === 'admin' ? 'bg-dona-gold/20 text-dona-gold' : 'bg-gray-100 text-gray-600'}>
                            {u.role === 'admin' ? 'Administrador' : 'Usuario'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setPasswordUserId(u.id)
                                setPasswordUsername(u.username)
                                setNewUserPassword('')
                                setShowPassword(true)
                              }}
                              className="gap-1"
                            >
                              <KeyRound className="h-4 w-4" />
                              Cambiar clave
                            </Button>
                            {u.role !== 'admin' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteUser(u.id, u.username)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create User Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Crear Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-dona-black mb-1">Usuario</label>
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Nombre de usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dona-black mb-1">Contraseña</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Contraseña"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dona-black mb-1">Rol</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancelar
            </Button>
            <Button
              onClick={createUser}
              disabled={creating}
              className="bg-dona-gold hover:bg-dona-gold/90 text-white"
            >
              {creating ? 'Creando...' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPassword} onOpenChange={setShowPassword}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Cambiar Clave — {passwordUsername}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <label className="block text-sm font-medium text-dona-black mb-1">Nueva contraseña</label>
            <Input
              type="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              placeholder="Nueva contraseña"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPassword(false)}>
              Cancelar
            </Button>
            <Button
              onClick={changePassword}
              disabled={changing}
              className="bg-dona-gold hover:bg-dona-gold/90 text-white"
            >
              {changing ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}