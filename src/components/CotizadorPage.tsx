'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
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
  Users,
  LogOut,
  Plus,
  Trash2,
  Eye,
  ArrowLeft,
  Save,
  Printer,
  MessageCircle,
  Mail,
  RotateCcw,
  FileText,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  username: string
  role: string
}

interface QuotationItem {
  id?: string
  description: string
  qty: number
  price: number
}

interface Quotation {
  id: string
  folio: string
  date: string
  client: string
  status: string
  notes: string
  createdAt: string
  createdById: string
  createdBy: { username: string }
  items: QuotationItem[]
}

interface ClientData {
  company: string
  contact: string
  email: string
  phone: string
  location: string
}

interface CotizadorPageProps {
  user: User
  onLogout: () => void
  onGoAdmin: () => void
  onGoLanding: () => void
  onGoDashboard?: () => void
}

const emptyClient: ClientData = {
  company: '',
  contact: '',
  email: '',
  phone: '',
  location: '',
}

function formatCLP(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-CL')
}

function generateFolio(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `DI${dd}${mm}${yyyy}`
}

function getTodayStr(): string {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

export default function CotizadorPage({ user, onLogout, onGoAdmin, onGoLanding, onGoDashboard }: CotizadorPageProps) {
  const { toast } = useToast()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)

  // Editor state
  const [editing, setEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState(getTodayStr())
  const [editClient, setEditClient] = useState<ClientData>({ ...emptyClient })
  const [editItems, setEditItems] = useState<QuotationItem[]>([])
  const [editNotes, setEditNotes] = useState('')
  const [editStatus, setEditStatus] = useState('pendiente')
  const [saving, setSaving] = useState(false)

  const fetchQuotations = useCallback(async () => {
    try {
      const res = await fetch('/api/quotations')
      if (res.ok) {
        const data = await res.json()
        setQuotations(data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuotations()
  }, [fetchQuotations])

  // Calculations
  const subtotalNeto = editItems.reduce((sum, item) => sum + item.qty * item.price, 0)
  const iva = Math.round(subtotalNeto * 0.19)
  const total = subtotalNeto + iva
  const totalItems = editItems.reduce((sum, item) => sum + item.qty, 0)

  // Dashboard stats
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const monthQuotations = quotations.filter((q) => {
    const d = new Date(q.createdAt)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  const allItemsCount = quotations.reduce(
    (sum, q) => sum + q.items.reduce((s, i) => s + i.qty, 0),
    0
  )

  // Actions
  const startNew = () => {
    setEditId(null)
    setEditDate(getTodayStr())
    setEditClient({ ...emptyClient })
    setEditItems([{ description: '', qty: 1, price: 0 }])
    setEditNotes('')
    setEditStatus('pendiente')
    setEditing(true)
  }

  const viewQuotation = (q: Quotation) => {
    setEditId(q.id)
    setEditDate(q.date)
    setEditClient(typeof q.client === 'string' ? JSON.parse(q.client) : q.client)
    setEditItems(q.items.map((i) => ({ ...i })))
    setEditNotes(q.notes)
    setEditStatus(q.status)
    setEditing(true)
  }

  const addItem = () => {
    setEditItems([...editItems, { description: '', qty: 1, price: 0 }])
  }

  const removeItem = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof QuotationItem, value: string | number) => {
    const updated = [...editItems]
    if (field === 'description') {
      updated[index] = { ...updated[index], description: value as string }
    } else if (field === 'qty') {
      updated[index] = { ...updated[index], qty: Math.max(1, parseInt(String(value)) || 0) }
    } else if (field === 'price') {
      updated[index] = { ...updated[index], price: Math.max(0, parseInt(String(value)) || 0) }
    }
    setEditItems(updated)
  }

  const resetEditor = () => {
    setEditId(null)
    setEditDate(getTodayStr())
    setEditClient({ ...emptyClient })
    setEditItems([{ description: '', qty: 1, price: 0 }])
    setEditNotes('')
    setEditStatus('pendiente')
  }

  const saveQuotation = async () => {
    if (editItems.length === 0 || editItems.every((i) => !i.description.trim())) {
      toast({ title: 'Error', description: 'Agregue al menos un item', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const body = {
        date: editDate,
        client: editClient,
        items: editItems.filter((i) => i.description.trim()),
        notes: editNotes,
        status: editStatus,
      }

      if (editId) {
        const res = await fetch(`/api/quotations/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          toast({ title: 'Guardado', description: 'Cotización actualizada' })
        }
      } else {
        const res = await fetch('/api/quotations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const data = await res.json()
          setEditId(data.id)
          setEditStatus(data.status)
          toast({ title: 'Creada', description: `Cotización ${data.folio} creada` })
        }
      }
      await fetchQuotations()
    } catch {
      toast({ title: 'Error', description: 'No se pudo guardar', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const deleteQuotation = async (id: string) => {
    if (!confirm('¿Eliminar esta cotización?')) return
    try {
      const res = await fetch(`/api/quotations/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Eliminada', description: 'Cotización eliminada' })
        setEditing(false)
        await fetchQuotations()
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar', variant: 'destructive' })
    }
  }

  const sendWhatsApp = () => {
    const folio = editId ? quotations.find((q) => q.id === editId)?.folio || generateFolio(editDate) : generateFolio(editDate)
    let msg = `*COTIZACIÓN ${folio}*\n`
    msg += `*Restaurante Doña Inés*\n\n`
    msg += `*Cliente:* ${editClient.contact}${editClient.company ? ` - ${editClient.company}` : ''}\n`
    msg += `*Fecha:* ${editDate}\n\n`
    msg += `*Detalle:*\n`
    editItems.forEach((item, i) => {
      if (item.description.trim()) {
        msg += `${i + 1}. ${item.description}\n`
        msg += `   ${item.qty} x ${formatCLP(item.price)} = ${formatCLP(item.qty * item.price * 1.19)}\n`
      }
    })
    msg += `\n*Subtotal Neto:* ${formatCLP(subtotalNeto)}\n`
    msg += `*IVA 19%:* ${formatCLP(iva)}\n`
    msg += `*TOTAL:* ${formatCLP(total)}\n\n`
    msg += `*Forma de pago:* Transferencia bancaria\n`
    msg += `Titular: Marcia Cecilia Maturana Torres\n`
    msg += `RUT: 11.009.828-6\n`
    msg += `Banco Santander - Cta Corriente\n`
    msg += `N° 000084373273\n\n`
    msg += `Cotización válida por 15 días.`

    window.open(`https://wa.me/56921787611?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const sendEmail = () => {
    const subject = encodeURIComponent(`Cotización ${editId ? quotations.find((q) => q.id === editId)?.folio || '' : ''} - Restaurante Doña Inés`)
    let body = `COTIZACIÓN - Restaurante Doña Inés\n\n`
    body += `Cliente: ${editClient.contact}${editClient.company ? ` - ${editClient.company}` : ''}\n`
    body += `Fecha: ${editDate}\n\n`
    body += `Detalle:\n`
    editItems.forEach((item, i) => {
      if (item.description.trim()) {
        body += `${i + 1}. ${item.description} | ${item.qty} x ${formatCLP(item.price)} = ${formatCLP(item.qty * item.price * 1.19)}\n`
      }
    })
    body += `\nSubtotal Neto: ${formatCLP(subtotalNeto)}\n`
    body += `IVA 19%: ${formatCLP(iva)}\n`
    body += `TOTAL: ${formatCLP(total)}\n\n`
    body += `Forma de pago: Transferencia bancaria\n`
    body += `Titular: Marcia Cecilia Maturana Torres\n`
    body += `RUT: 11.009.828-6\n`
    body += `Banco Santander - Cta Corriente\n`
    body += `N° 000084373273\n\n`
    body += `Cotización válida por 15 días.`

    window.open(`mailto:${editClient.email || ''}?subject=${subject}&body=${encodeURIComponent(body)}`)
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'enviada':
        return 'bg-dona-turquoise/20 text-dona-turquoise'
      case 'aceptada':
        return 'bg-green-100 text-green-800'
      case 'rechazada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const folio = editId ? quotations.find((q) => q.id === editId)?.folio || generateFolio(editDate) : generateFolio(editDate)

  // --- EDITOR VIEW ---
  if (editing) {
    return (
      <div className="min-h-screen bg-dona-cream">
        {/* Top bar */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-dona-black/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <LogoWrapper size={28} />
              <span className="text-dona-gold font-semibold text-sm hidden sm:block">
                Cotizador — Doña Inés
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm hidden sm:block">{user.username}</span>
              {user.role === 'admin' && (
                <Button variant="ghost" size="sm" onClick={onGoAdmin} className="text-white hover:text-dona-gold gap-1">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Usuarios</span>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => { if (editing) { setEditing(false) } }} className="text-white hover:text-dona-gold gap-1">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">{editing ? 'Volver' : 'Inicio'}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:text-red-400 gap-1">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="fixed top-[48px] left-0 right-0 z-30 bg-white border-b shadow-sm">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-2 px-4 py-2">
            <Button size="sm" onClick={addItem} className="bg-dona-gold hover:bg-dona-gold/90 text-white gap-1">
              <Plus className="h-4 w-4" /> Item
            </Button>
            <Button size="sm" onClick={saveQuotation} disabled={saving} className="bg-dona-turquoise hover:bg-dona-turquoise/90 text-white gap-1">
              <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.print()} className="gap-1">
              <Printer className="h-4 w-4" /> Imprimir
            </Button>
            <Button size="sm" onClick={sendWhatsApp} className="bg-[#25D366] hover:bg-[#20bd5a] text-white gap-1">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
            <Button size="sm" variant="outline" onClick={sendEmail} className="gap-1">
              <Mail className="h-4 w-4" /> Email
            </Button>
            <Button size="sm" variant="outline" onClick={resetEditor} className="text-red-600 border-red-200 hover:bg-red-50 gap-1">
              <RotateCcw className="h-4 w-4" /> Reiniciar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Volver
            </Button>
            {editId && (
              <Button size="sm" variant="outline" onClick={() => deleteQuotation(editId)} className="ml-auto text-red-600 border-red-200 hover:bg-red-50 gap-1">
                <Trash2 className="h-4 w-4" /> Eliminar
              </Button>
            )}
          </div>
        </div>

        {/* Document */}
        <main className="pt-[108px] pb-12 px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-start gap-6 mb-6">
              <LogoWrapper size={110} variant="none" />
              <div className="text-left">
                <h1 className="text-2xl font-bold text-[#4A2C0A]">Restaurante Doña Inés</h1>
                <p className="text-gray-600">Restaurant</p>
                <p className="text-gray-600">Los Pinos 2202, Macal 2, El Melón, Nogales</p>
                <p className="text-dona-gold font-semibold text-lg">+56 9 2178 7611</p>
              </div>
            </div>

            {/* Title bar */}
            <div
              className="rounded-t-lg px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6"
              style={{ backgroundColor: '#B85C1E' }}
            >
              <h2 className="text-white font-bold text-lg">COTIZACIÓN DE COLACIONES</h2>
              <div className="flex items-center gap-4 text-white">
                <span className="font-semibold">Folio: {folio}</span>
                <Input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-40 bg-white/20 border-white/30 text-white [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Client Section */}
            <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: '#F5E6D3' }}>
              <h3 className="font-bold text-dona-black mb-4 text-sm uppercase tracking-wide">
                DATOS DEL CLIENTE
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Empresa</label>
                  <Input
                    value={editClient.company}
                    onChange={(e) => setEditClient({ ...editClient, company: e.target.value })}
                    placeholder="Nombre empresa"
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Contacto</label>
                  <Input
                    value={editClient.contact}
                    onChange={(e) => setEditClient({ ...editClient, contact: e.target.value })}
                    placeholder="Nombre contacto"
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <Input
                    value={editClient.email}
                    onChange={(e) => setEditClient({ ...editClient, email: e.target.value })}
                    placeholder="email@empresa.cl"
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                  <Input
                    value={editClient.phone}
                    onChange={(e) => setEditClient({ ...editClient, phone: e.target.value })}
                    placeholder="+56 9 XXXX XXXX"
                    className="bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Lugar de entrega</label>
                  <Input
                    value={editClient.location}
                    onChange={(e) => setEditClient({ ...editClient, location: e.target.value })}
                    placeholder="Dirección de entrega"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-dona-black text-white">
                    <th className="text-left px-4 py-3 rounded-tl-lg">Descripción</th>
                    <th className="text-center px-3 py-3 w-20">Cant.</th>
                    <th className="text-right px-3 py-3 w-32">Precio Neto</th>
                    <th className="text-right px-3 py-3 w-28">IVA</th>
                    <th className="text-right px-4 py-3 w-32">Total</th>
                    <th className="px-2 py-3 w-10 rounded-tr-lg"></th>
                  </tr>
                </thead>
                <tbody>
                  {editItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Descripción del item"
                          className="border-0 shadow-none p-0 h-auto focus-visible:ring-0"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateItem(index, 'qty', e.target.value)}
                          className="border-0 shadow-none p-0 h-auto text-center focus-visible:ring-0 w-16 mx-auto"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', e.target.value)}
                          className="border-0 shadow-none p-0 h-auto text-right focus-visible:ring-0 w-28 ml-auto"
                        />
                      </td>
                      <td className="px-3 py-2 text-right text-gray-500 text-xs">
                        {formatCLP(item.price * 0.19)}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {formatCLP(item.qty * item.price * 1.19)}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => removeItem(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Eliminar item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={2} />
                    <td colSpan={2} className="text-right py-2 text-gray-600">
                      Subtotal Neto:
                    </td>
                    <td className="text-right py-2 font-semibold">{formatCLP(subtotalNeto)}</td>
                    <td />
                  </tr>
                  <tr>
                    <td colSpan={2} />
                    <td colSpan={2} className="text-right py-2 text-gray-600">
                      IVA 19%:
                    </td>
                    <td className="text-right py-2 font-semibold">{formatCLP(iva)}</td>
                    <td />
                  </tr>
                  <tr>
                    <td colSpan={2} />
                    <td colSpan={2} className="text-right py-3 font-bold text-lg">
                      TOTAL:
                    </td>
                    <td
                      className="text-right py-3 px-4 font-bold text-lg text-white rounded-r-lg"
                      style={{ backgroundColor: '#C9962B' }}
                    >
                      {formatCLP(total)}
                    </td>
                    <td
                      className="py-3 rounded-r-lg"
                      style={{ backgroundColor: '#C9962B' }}
                    />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-600 mb-1">Notas</label>
              <Input
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Notas adicionales..."
              />
            </div>

            {/* Status (only for existing) */}
            {editId && (
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full sm:w-48 border rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="enviada">Enviada</option>
                  <option value="aceptada">Aceptada</option>
                  <option value="rechazada">Rechazada</option>
                </select>
              </div>
            )}

            {/* Payment Section */}
            <div className="rounded-lg p-6 bg-gray-50 mb-6">
              <h3 className="font-bold text-dona-black mb-4 text-sm uppercase tracking-wide">
                FORMA DE PAGO
              </h3>
              <p className="text-gray-700 mb-4 font-medium">Transferencia bancaria</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Titular:</span>{' '}
                  <span className="font-medium">Marcia Cecilia Maturana Torres</span>
                </div>
                <div>
                  <span className="text-gray-500">RUT:</span>{' '}
                  <span className="font-medium">11.009.828-6</span>
                </div>
                <div>
                  <span className="text-gray-500">Banco:</span>{' '}
                  <span className="font-medium">Banco Santander</span>
                </div>
                <div>
                  <span className="text-gray-500">Tipo:</span>{' '}
                  <span className="font-medium">Cuenta Corriente</span>
                </div>
                <div>
                  <span className="text-gray-500">N°:</span>{' '}
                  <span className="font-medium">000084373273</span>
                </div>
                <div>
                  <span className="text-gray-500">Giro:</span>{' '}
                  <span className="font-medium">Restaurant</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              Cotización válida por 15 días · Restaurante Doña Inés · +56 9 2178 7611
            </div>
          </div>
        </main>
      </div>
    )
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-dona-cream">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dona-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <LogoWrapper size={28} />
            <span className="text-dona-gold font-semibold text-sm hidden sm:block">
              Cotizador — Doña Inés
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm hidden sm:block">{user.username}</span>
            {user.role === 'admin' && (
              <Button variant="ghost" size="sm" onClick={onGoAdmin} className="text-white hover:text-dona-gold gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Usuarios</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => { if (editing) { setEditing(false) } }} className="text-white hover:text-dona-gold gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{editing ? 'Volver' : 'Inicio'}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:text-red-400 gap-1">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Cotizaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-dona-black">{quotations.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cotizaciones del Mes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-dona-gold">{monthQuotations.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-dona-turquoise">{allItemsCount}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quotations List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold text-dona-black">Cotizaciones</CardTitle>
              <Button onClick={startNew} className="bg-dona-gold hover:bg-dona-gold/90 text-white gap-2">
                <Plus className="h-4 w-4" />
                Nueva cotización
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Cargando...</div>
              ) : quotations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay cotizaciones. Cree la primera.
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Folio</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="hidden sm:table-cell">Cliente</TableHead>
                        <TableHead className="hidden md:table-cell">Creada por</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotations.map((q) => {
                        const client = typeof q.client === 'string' ? JSON.parse(q.client) : q.client
                        return (
                          <TableRow key={q.id}>
                            <TableCell className="font-semibold">{q.folio}</TableCell>
                            <TableCell>{q.date}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {client.contact || client.company || '-'}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {q.createdBy.username}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={statusColor(q.status)}>
                                {q.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => viewQuotation(q)}
                                className="gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                Ver
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}