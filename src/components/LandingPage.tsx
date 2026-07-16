'use client'

import { useState } from 'react'
import Link from 'next/link'
import LogoWrapper from '@/components/LogoWrapper'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Download,
  Copy,
  Check,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LandingPageProps {
  onGoLogin: () => void
}

export default function LandingPage({ onGoLogin }: LandingPageProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // Cotización tab
  const [cotName, setCotName] = useState('')
  const [cotEmpresa, setCotEmpresa] = useState('')
  const [cotTel, setCotTel] = useState('')
  const [cotMsg, setCotMsg] = useState('')

  // Consulta tab
  const [conName, setConName] = useState('')
  const [conTel, setConTel] = useState('')
  const [conMsg, setConMsg] = useState('')

  // Reserva tab
  const [resName, setResName] = useState('')
  const [resTel, setResTel] = useState('')
  const [resFecha, setResFecha] = useState('')
  const [resHora, setResHora] = useState('')
  const [resPersonas, setResPersonas] = useState('')
  const [resMotivo, setResMotivo] = useState('')

  const buildCotizacionMsg = () =>
    `Hola, soy *${cotName}*${cotEmpresa ? ` de *${cotEmpresa}*` : ''}.\n\nMe gustaría solicitar una *cotización*:\n\n${cotMsg}\n\nTeléfono: ${cotTel}\n\nGracias.`

  const buildConsultaMsg = () =>
    `Hola, soy *${conName}*.\n\nTengo una *consulta*:\n\n${conMsg}\n\nTeléfono: ${conTel}\n\nGracias.`

  const buildReservaMsg = () =>
    `Hola, soy *${resName}*.\n\nMe gustaría hacer una *reserva*:\n\n📅 Fecha: ${resFecha}\n🕐 Hora: ${resHora}\n👥 Personas: ${resPersonas}\n📝 Motivo: ${resMotivo}\n\nTeléfono: ${resTel}\n\nGracias.`

  const sendWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/56921787611?text=${encoded}`, '_blank')
  }

  const copyToClipboard = async (message: string) => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      toast({ title: 'Copiado', description: 'Mensaje copiado al portapapeles' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Error', description: 'No se pudo copiar', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dona-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <LogoWrapper size={36} />
            <span className="text-dona-gold font-semibold text-lg hidden sm:block">
              Restaurante Doña Inés
            </span>
          </div>
          <Button
            onClick={onGoLogin}
            className="bg-dona-gold hover:bg-dona-gold/90 text-white text-sm"
          >
            Acceso
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Static background image */}
        <img
          src="/foto1.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 flex flex-col items-center gap-6">
          <LogoWrapper size={160} />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
            Restaurante
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-dona-gold">
            Doña Inés
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-xl">
            Comida casera con sazón de hogar, colaciones empresariales y eventos.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <a
              href="https://wa.me/56921787611"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 text-base px-6 py-5">
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </Button>
            </a>
            <a href="/api/vcard" download>
              <Button className="bg-dona-turquoise hover:bg-dona-turquoise/90 text-white gap-2 text-base px-6 py-5">
                <Download className="h-5 w-5" />
                Guardar Contacto
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Qué ofrecemos */}
      <section className="py-20 px-4 bg-dona-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-dona-black mb-8">
            ¿Qué ofrecemos?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Restaurante Doña Inés es un lugar familiar ubicado en El Melón, Nogales,
            Región de Valparaíso. Especializados en comida casera chilena, ofrecemos
            servicios de colaciones empresariales, desayunos, almuerzos, cenas y
            catering para eventos especiales. También contamos con zona de bar y
            servicios residenciales. Un espacio con ambiente cálido y atención
            personalizada para cada ocasión.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-dona-black mb-10 text-center">
            Nuestro Local
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden aspect-[4/3] transition-transform duration-300 hover:scale-105">
              <img src="/foto1.jpg" alt="Restaurante exterior" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-[4/3] transition-transform duration-300 hover:scale-105">
              <img src="/foto2.jpg" alt="Interior del restaurante" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-[4/3] transition-transform duration-300 hover:scale-105">
              <img src="/foto3.jpg" alt="Comida casera" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-[4/3] transition-transform duration-300 hover:scale-105">
              <img src="/foto4.jpg" alt="Ambiente del restaurante" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Tabs */}
      <section className="py-20 px-4 bg-dona-cream" id="contacto">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-dona-black mb-10 text-center">
            ¿En qué podemos ayudarte?
          </h2>
          <Tabs defaultValue="cotizacion" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="cotizacion">Cotización</TabsTrigger>
              <TabsTrigger value="consulta">Consulta</TabsTrigger>
              <TabsTrigger value="reserva">Reserva</TabsTrigger>
            </TabsList>

            {/* Cotización Tab */}
            <TabsContent value="cotizacion">
              <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dona-black mb-1">
                      Nombre *
                    </label>
                    <Input
                      value={cotName}
                      onChange={(e) => setCotName(e.target.value)}
                      placeholder="Su nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dona-black mb-1">
                      Empresa
                    </label>
                    <Input
                      value={cotEmpresa}
                      onChange={(e) => setCotEmpresa(e.target.value)}
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dona-black mb-1">
                    Teléfono *
                  </label>
                  <Input
                    value={cotTel}
                    onChange={(e) => setCotTel(e.target.value)}
                    placeholder="+56 9 XXXX XXXX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dona-black mb-1">
                    Mensaje
                  </label>
                  <Textarea
                    value={cotMsg}
                    onChange={(e) => setCotMsg(e.target.value)}
                    placeholder="Describa lo que necesita cotizar..."
                    rows={4}
                  />
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={() => sendWhatsApp(buildCotizacionMsg())}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enviar por WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(buildCotizacionMsg())}
                    className="gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copiar mensaje
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Consulta Tab */}
            <TabsContent value="consulta">
              <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-dona-black mb-1">
                    Nombre *
                  </label>
                  <Input
                    value={conName}
                    onChange={(e) => setConName(e.target.value)}
                    placeholder="Su nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dona-black mb-1">
                    Teléfono *
                  </label>
                  <Input
                    value={conTel}
                    onChange={(e) => setConTel(e.target.value)}
                    placeholder="+56 9 XXXX XXXX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dona-black mb-1">
                    Mensaje
                  </label>
                  <Textarea
                    value={conMsg}
                    onChange={(e) => setConMsg(e.target.value)}
                    placeholder="Escriba su consulta..."
                    rows={4}
                  />
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={() => sendWhatsApp(buildConsultaMsg())}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enviar por WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(buildConsultaMsg())}
                    className="gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copiar mensaje
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Reserva Tab */}
            <TabsContent value="reserva">
              <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dona-black mb-1">
                      Nombre *
                    </label>
                    <Input
                      value={resName}
                      onChange={(e) => setResName(e.target.value)}
                      placeholder="Su nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dona-black mb-1">
                      Teléfono *
                    </label>
                    <Input
                      value={resTel}
                      onChange={(e) => setResTel(e.target.value)}
                      placeholder="+56 9 XXXX XXXX"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dona-black mb-1">
                      Fecha
                    </label>
                    <Input
                      type="date"
                      value={resFecha}
                      onChange={(e) => setResFecha(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dona-black mb-1">
                      Hora
                    </label>
                    <Input
                      type="time"
                      value={resHora}
                      onChange={(e) => setResHora(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dona-black mb-1">
                      N° de personas
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={resPersonas}
                      onChange={(e) => setResPersonas(e.target.value)}
                      placeholder="Ej: 10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dona-black mb-1">
                    Motivo
                  </label>
                  <Input
                    value={resMotivo}
                    onChange={(e) => setResMotivo(e.target.value)}
                    placeholder="Ej: Cumpleaños, reunión, etc."
                  />
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={() => sendWhatsApp(buildReservaMsg())}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enviar por WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(buildReservaMsg())}
                    className="gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copiar mensaje
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-dona-black mb-6">Contacto</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <a
                  href="https://wa.me/56921787611"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-dona-turquoise transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-[#25D366] shrink-0" />
                  <span>+56 9 2178 7611</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <a
                  href="tel:+56921787611"
                  className="flex items-center gap-3 text-gray-700 hover:text-dona-turquoise transition-colors"
                >
                  <Phone className="h-5 w-5 text-dona-turquoise shrink-0" />
                  <span>+56 9 2178 7611</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <a
                  href="mailto:marciamaturana55@gmail.com"
                  className="flex items-center gap-3 text-gray-700 hover:text-dona-turquoise transition-colors"
                >
                  <Mail className="h-5 w-5 text-dona-gold shrink-0" />
                  <span className="break-all">marciamaturana55@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-dona-brown shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Los Pinos 2202, Macal 2, El Melón, Nogales, Valparaíso
                </span>
              </li>
            </ul>
            <a href="/api/vcard" download className="mt-6 inline-block">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Descargar Contacto (vCard)
              </Button>
            </a>
          </div>
          <div className="rounded-xl overflow-hidden aspect-[4/3]">
            <iframe
              src="https://maps.google.com/maps?q=-32.6849758,-71.2118846&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Restaurante Doña Inés"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dona-black text-white py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
          <p className="text-dona-gold font-semibold text-lg">
            © 2026 Restaurante Doña Inés
          </p>
          <QRCodeDisplay
            url="https://restaurante-dona-ines.vercel.app"
            size={160}
            logoSize={40}
            fgColor="#C9962B"
            bgColor="#1A1A1A"
          />
          <p className="text-gray-400 text-sm text-center">
            Escanea para visitarnos
          </p>
          <div className="text-center space-y-1">
            <p className="text-gray-400 text-sm">
              Los Pinos 2202, Macal 2, El Melón, Nogales, Valparaíso
            </p>
            <p className="text-gray-400 text-sm">
              <Link href="tel:+56921787611" className="hover:text-dona-gold transition-colors">
                +56 9 2178 7611
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}