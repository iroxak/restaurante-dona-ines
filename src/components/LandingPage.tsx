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
    `Hola, soy *${resName}*.\n\nMe gustaría hacer una *reserva*:\n\nFecha: ${resFecha}\nHora: ${resHora}\nPersonas: ${resPersonas}\nMotivo: ${resMotivo}\n\nTeléfono: ${resTel}\n\nGracias.`

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
    <div className="min-h-screen font-body">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dona-dark/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <LogoWrapper size={40} />
            <span className="font-heading text-dona-gold-light font-semibold text-lg hidden sm:block tracking-wide">
              Doña Inés
            </span>
          </div>
          <Button
            onClick={onGoLogin}
            className="bg-dona-gold hover:bg-dona-gold-light text-white text-sm font-heading"
          >
            Acceso
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/foto1.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 text-center px-4 flex flex-col items-center gap-5">
          <LogoWrapper size={200} />
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl font-bold text-white tracking-wide drop-shadow-lg">
            Restaurante
          </h1>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl font-bold text-dona-gold-light drop-shadow-lg">
            Doña Inés
          </h1>
          <p className="font-body text-gray-200 text-lg sm:text-xl md:text-2xl max-w-2xl leading-relaxed mt-2">
            Comida casera con sazón de hogar
          </p>
          <p className="font-body text-gray-300 text-base sm:text-lg max-w-xl">
            Colaciones empresariales, eventos y más
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <a
              href="https://wa.me/56921787611"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 text-base px-8 py-6 font-heading text-lg">
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </Button>
            </a>
            <a href="/api/vcard" download>
              <Button className="bg-dona-brown hover:bg-dona-brown/90 text-white gap-2 text-base px-8 py-6 font-heading text-lg">
                <Download className="h-5 w-5" />
                Guardar Contacto
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Qué ofrecemos */}
      <section className="py-24 px-4 bg-dona-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-dona-dark mb-8">
            ¿Qué ofrecemos?
          </h2>
          <p className="font-body text-lg sm:text-xl text-dona-dark/80 leading-relaxed">
            Restaurante Doña Inés es un lugar familiar ubicado en El Melón, Nogales,
            Región de Valparaíso. Especializados en comida casera chilena, ofrecemos
            servicios de colaciones empresariales, desayunos, almuerzos, cenas y
            catering para eventos especiales. Un espacio con ambiente cálido y atención
            personalizada para cada ocasión.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-dona-dark mb-12 text-center">
            Nuestro Local
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] transition-transform duration-300 hover:scale-[1.03] shadow-md">
              <img src="/foto1.jpg" alt="Restaurante exterior" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] transition-transform duration-300 hover:scale-[1.03] shadow-md">
              <img src="/foto2.jpg" alt="Interior del restaurante" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] transition-transform duration-300 hover:scale-[1.03] shadow-md">
              <img src="/foto3.jpg" alt="Comida casera" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Tabs */}
      <section className="py-24 px-4 bg-dona-cream" id="contacto">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-dona-dark mb-10 text-center">
            ¿En qué podemos ayudarte?
          </h2>
          <Tabs defaultValue="cotizacion" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="cotizacion" className="font-heading">Cotización</TabsTrigger>
              <TabsTrigger value="consulta" className="font-heading">Consulta</TabsTrigger>
              <TabsTrigger value="reserva" className="font-heading">Reserva</TabsTrigger>
            </TabsList>

            {/* Cotización Tab */}
            <TabsContent value="cotizacion">
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm border border-dona-warm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
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
                    <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
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
                  <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
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
                  <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
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
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm border border-dona-warm">
                <div>
                  <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
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
                  <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
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
                  <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
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
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm border border-dona-warm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
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
                    <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
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
                    <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
                      Fecha
                    </label>
                    <Input
                      type="date"
                      value={resFecha}
                      onChange={(e) => setResFecha(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
                      Hora
                    </label>
                    <Input
                      type="time"
                      value={resHora}
                      onChange={(e) => setResHora(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
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
                  <label className="block text-sm font-medium text-dona-dark mb-1 font-heading">
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
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading text-3xl font-bold text-dona-dark mb-8">Contacto</h2>
            <ul className="space-y-5">
              <li className="flex items-center gap-4">
                <a
                  href="https://wa.me/56921787611"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-dona-dark/80 hover:text-dona-brown transition-colors text-lg"
                >
                  <MessageCircle className="h-5 w-5 text-[#25D366] shrink-0" />
                  <span>+56 9 2178 7611</span>
                </a>
              </li>
              <li className="flex items-center gap-4">
                <a
                  href="tel:+56921787611"
                  className="flex items-center gap-4 text-dona-dark/80 hover:text-dona-brown transition-colors text-lg"
                >
                  <Phone className="h-5 w-5 text-dona-brown shrink-0" />
                  <span>+56 9 2178 7611</span>
                </a>
              </li>
              <li className="flex items-center gap-4">
                <a
                  href="mailto:marciamaturana55@gmail.com"
                  className="flex items-center gap-4 text-dona-dark/80 hover:text-dona-brown transition-colors text-lg"
                >
                  <Mail className="h-5 w-5 text-dona-gold shrink-0" />
                  <span className="break-all">marciamaturana55@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-dona-terra shrink-0 mt-0.5" />
                <span className="text-dona-dark/80 text-lg">
                  Los Pinos 2202, Macal 2, El Melón, Nogales, Valparaíso
                </span>
              </li>
            </ul>
            <a href="/api/vcard" download className="mt-8 inline-block">
              <Button variant="outline" className="gap-2 font-heading">
                <Download className="h-4 w-4" />
                Descargar Contacto (vCard)
              </Button>
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-md">
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
      <footer className="bg-dona-dark text-white py-14 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
          <p className="font-heading text-dona-gold-light font-semibold text-xl tracking-wide">
            Restaurante Doña Inés
          </p>
          <QRCodeDisplay
            url="https://restaurante-dona-ines.vercel.app"
            size={160}
            logoSize={40}
            fgColor="#A07830"
            bgColor="#2D1B0E"
          />
          <p className="text-dona-dark/60 text-sm font-body">
            Escanea para visitarnos
          </p>
          <div className="text-center space-y-1">
            <p className="text-dona-dark/50 text-sm">
              Los Pinos 2202, Macal 2, El Melón, Nogales, Valparaíso
            </p>
            <p className="text-dona-dark/50 text-sm">
              <Link href="tel:+56921787611" className="hover:text-dona-gold-light transition-colors">
                +56 9 2178 7611
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}