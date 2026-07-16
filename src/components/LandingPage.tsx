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
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dona-dark/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <LogoWrapper size={38} />
            <div className="hidden sm:block">
              <span className="font-heading text-dona-gold font-semibold text-xl tracking-wider">
                Doña Inés
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-white/40 font-body font-light">
                Restaurante
              </span>
            </div>
          </div>
          <Button
            onClick={onGoLogin}
            className="bg-transparent hover:bg-white/10 text-dona-gold border border-dona-gold/40 hover:border-dona-gold text-sm font-body font-medium tracking-wide px-5 transition-all duration-300"
          >
            Acceso
          </Button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center">
        <img
          src="/foto1.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-105"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/80" />
        {/* Subtle gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dona-gold/40 to-transparent" />

        <div className="relative z-10 text-center px-4 flex flex-col items-center gap-3 pt-16 pb-8">
          <LogoWrapper size={220} />
          <div className="mt-2">
            <p className="font-body text-dona-gold/70 text-xs sm:text-sm uppercase tracking-[0.35em] mb-3 font-light">
              Bienvenidos a
            </p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl font-bold text-white tracking-wide text-glow-gold leading-[0.95]">
              Restaurante
            </h1>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl font-bold text-dona-gold text-glow-gold leading-[0.95]">
              Doña Inés
            </h1>
          </div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-dona-gold/60 to-transparent mt-4" />
          <p className="font-body text-white/70 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed mt-2 font-light">
            Comida casera con sazón de hogar
          </p>
          <p className="font-body text-white/45 text-sm sm:text-base max-w-md font-light tracking-wide">
            Colaciones empresariales, eventos y más
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <a
              href="https://wa.me/56921787611"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 text-sm px-7 py-6 font-body font-medium tracking-wide rounded-none">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </a>
            <a href="/api/vcard" download>
              <Button className="bg-transparent hover:bg-white/10 text-white border border-white/25 hover:border-dona-gold/60 gap-2 text-sm px-7 py-6 font-body font-medium tracking-wide rounded-none transition-all duration-300">
                <Download className="h-4 w-4" />
                Guardar Contacto
              </Button>
            </a>
          </div>
        </div>

        {/* Bottom gold line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dona-gold/40 to-transparent" />
      </section>

      {/* ── Qué ofrecemos ── */}
      <section className="py-28 px-4 bg-dona-cream">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body text-dona-gold text-xs uppercase tracking-[0.3em] mb-4 font-medium">
            Sobre nosotros
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-dona-dark mb-8 leading-tight">
            ¿Qué ofrecemos?
          </h2>
          <div className="w-12 h-px bg-dona-gold/50 mx-auto mb-8" />
          <p className="font-body text-base sm:text-lg text-dona-dark/70 leading-[1.85] max-w-2xl mx-auto font-light">
            Restaurante Doña Inés es un lugar familiar ubicado en El Melón, Nogales,
            Región de Valparaíso. Especializados en comida casera chilena, ofrecemos
            servicios de colaciones empresariales, desayunos, almuerzos, cenas y
            catering para eventos especiales. Un espacio con ambiente cálido y atención
            personalizada para cada ocasión.
          </p>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="py-28 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-body text-dona-gold text-xs uppercase tracking-[0.3em] mb-4 font-medium">
              Nuestro espacio
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-dona-dark leading-tight">
              Nuestro Local
            </h2>
            <div className="w-12 h-px bg-dona-gold/50 mx-auto mt-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-sm overflow-hidden aspect-[4/3] transition-all duration-500 hover:scale-[1.02] shadow-lg group">
              <img src="/foto1.jpg" alt="Restaurante Doña Inés - exterior" className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500" loading="lazy" />
            </div>
            <div className="rounded-sm overflow-hidden aspect-[4/3] transition-all duration-500 hover:scale-[1.02] shadow-lg group">
              <img src="/foto2.jpg" alt="Restaurante Doña Inés - interior" className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500" loading="lazy" />
            </div>
            <div className="rounded-sm overflow-hidden aspect-[4/3] transition-all duration-500 hover:scale-[1.02] shadow-lg group">
              <img src="/foto3.jpg" alt="Restaurante Doña Inés - ambiente" className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Tabs ── */}
      <section className="py-28 px-4 bg-dona-cream" id="contacto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-body text-dona-gold text-xs uppercase tracking-[0.3em] mb-4 font-medium">
              Contáctanos
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-dona-dark leading-tight">
              ¿En qué podemos ayudarte?
            </h2>
            <div className="w-12 h-px bg-dona-gold/50 mx-auto mt-6" />
          </div>
          <Tabs defaultValue="cotizacion" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-transparent border-b border-dona-gold/20 h-auto p-0 gap-0">
              <TabsTrigger value="cotizacion" className="font-body text-sm font-medium tracking-wide rounded-none border-b-2 border-transparent data-[state=active]:border-dona-gold data-[state=active]:bg-transparent data-[state=active]:text-dona-dark data-[state=active]:shadow-none pb-3 pt-1 text-dona-dark/50 transition-all">
                Cotización
              </TabsTrigger>
              <TabsTrigger value="consulta" className="font-body text-sm font-medium tracking-wide rounded-none border-b-2 border-transparent data-[state=active]:border-dona-gold data-[state=active]:bg-transparent data-[state=active]:text-dona-dark data-[state=active]:shadow-none pb-3 pt-1 text-dona-dark/50 transition-all">
                Consulta
              </TabsTrigger>
              <TabsTrigger value="reserva" className="font-body text-sm font-medium tracking-wide rounded-none border-b-2 border-transparent data-[state=active]:border-dona-gold data-[state=active]:bg-transparent data-[state=active]:text-dona-dark data-[state=active]:shadow-none pb-3 pt-1 text-dona-dark/50 transition-all">
                Reserva
              </TabsTrigger>
            </TabsList>

            {/* Cotización Tab */}
            <TabsContent value="cotizacion">
              <div className="bg-white rounded-sm p-8 sm:p-10 space-y-5 shadow-sm border border-dona-gold/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                      Nombre *
                    </label>
                    <Input
                      value={cotName}
                      onChange={(e) => setCotName(e.target.value)}
                      placeholder="Su nombre"
                      required
                      className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                      Empresa
                    </label>
                    <Input
                      value={cotEmpresa}
                      onChange={(e) => setCotEmpresa(e.target.value)}
                      placeholder="Nombre de la empresa"
                      className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                    Teléfono *
                  </label>
                  <Input
                    value={cotTel}
                    onChange={(e) => setCotTel(e.target.value)}
                    placeholder="+56 9 XXXX XXXX"
                    required
                    className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                    Mensaje
                  </label>
                  <Textarea
                    value={cotMsg}
                    onChange={(e) => setCotMsg(e.target.value)}
                    placeholder="Describa lo que necesita cotizar..."
                    rows={4}
                    className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body resize-none"
                  />
                </div>
                <div className="flex flex-wrap gap-3 pt-3">
                  <Button
                    onClick={() => sendWhatsApp(buildCotizacionMsg())}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 rounded-none font-body font-medium tracking-wide"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enviar por WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(buildCotizacionMsg())}
                    className="gap-2 rounded-none border-dona-gold/20 hover:border-dona-gold/50 font-body"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copiar mensaje
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Consulta Tab */}
            <TabsContent value="consulta">
              <div className="bg-white rounded-sm p-8 sm:p-10 space-y-5 shadow-sm border border-dona-gold/10">
                <div>
                  <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                    Nombre *
                  </label>
                  <Input
                    value={conName}
                    onChange={(e) => setConName(e.target.value)}
                    placeholder="Su nombre"
                    required
                    className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                    Teléfono *
                  </label>
                  <Input
                    value={conTel}
                    onChange={(e) => setConTel(e.target.value)}
                    placeholder="+56 9 XXXX XXXX"
                    required
                    className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                    Mensaje
                  </label>
                  <Textarea
                    value={conMsg}
                    onChange={(e) => setConMsg(e.target.value)}
                    placeholder="Escriba su consulta..."
                    rows={4}
                    className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body resize-none"
                  />
                </div>
                <div className="flex flex-wrap gap-3 pt-3">
                  <Button
                    onClick={() => sendWhatsApp(buildConsultaMsg())}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 rounded-none font-body font-medium tracking-wide"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enviar por WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(buildConsultaMsg())}
                    className="gap-2 rounded-none border-dona-gold/20 hover:border-dona-gold/50 font-body"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copiar mensaje
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Reserva Tab */}
            <TabsContent value="reserva">
              <div className="bg-white rounded-sm p-8 sm:p-10 space-y-5 shadow-sm border border-dona-gold/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                      Nombre *
                    </label>
                    <Input
                      value={resName}
                      onChange={(e) => setResName(e.target.value)}
                      placeholder="Su nombre"
                      required
                      className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                      Teléfono *
                    </label>
                    <Input
                      value={resTel}
                      onChange={(e) => setResTel(e.target.value)}
                      placeholder="+56 9 XXXX XXXX"
                      required
                      className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                      Fecha
                    </label>
                    <Input
                      type="date"
                      value={resFecha}
                      onChange={(e) => setResFecha(e.target.value)}
                      className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                      Hora
                    </label>
                    <Input
                      type="time"
                      value={resHora}
                      onChange={(e) => setResHora(e.target.value)}
                      className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                      N° de personas
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={resPersonas}
                      onChange={(e) => setResPersonas(e.target.value)}
                      placeholder="Ej: 10"
                      className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dona-dark/60 mb-2 font-body uppercase tracking-wider">
                    Motivo
                  </label>
                  <Input
                    value={resMotivo}
                    onChange={(e) => setResMotivo(e.target.value)}
                    placeholder="Ej: Cumpleaños, reunión, etc."
                    className="rounded-sm border-dona-gold/15 focus-visible:border-dona-gold/40 font-body"
                  />
                </div>
                <div className="flex flex-wrap gap-3 pt-3">
                  <Button
                    onClick={() => sendWhatsApp(buildReservaMsg())}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 rounded-none font-body font-medium tracking-wide"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enviar por WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(buildReservaMsg())}
                    className="gap-2 rounded-none border-dona-gold/20 hover:border-dona-gold/50 font-body"
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

      {/* ── Contact Info ── */}
      <section className="py-28 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="font-body text-dona-gold text-xs uppercase tracking-[0.3em] mb-4 font-medium">
              Visítanos
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-dona-dark mb-10 leading-tight">
              Contacto
            </h2>
            <div className="w-12 h-px bg-dona-gold/50 mb-10" />
            <ul className="space-y-7">
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-dona-cream flex items-center justify-center group-hover:bg-dona-gold/10 transition-colors">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                </div>
                <a
                  href="https://wa.me/56921787611"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dona-dark/70 hover:text-dona-dark transition-colors font-body text-[15px]"
                >
                  +56 9 2178 7611
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-dona-cream flex items-center justify-center group-hover:bg-dona-gold/10 transition-colors">
                  <Phone className="h-4 w-4 text-dona-gold" />
                </div>
                <a
                  href="tel:+56921787611"
                  className="text-dona-dark/70 hover:text-dona-dark transition-colors font-body text-[15px]"
                >
                  +56 9 2178 7611
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-dona-cream flex items-center justify-center group-hover:bg-dona-gold/10 transition-colors">
                  <Mail className="h-4 w-4 text-dona-wine" />
                </div>
                <a
                  href="mailto:marciamaturana55@gmail.com"
                  className="text-dona-dark/70 hover:text-dona-dark transition-colors font-body text-[15px] break-all"
                >
                  marciamaturana55@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-dona-cream flex items-center justify-center group-hover:bg-dona-gold/10 transition-colors shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-dona-terra" />
                </div>
                <span className="text-dona-dark/70 font-body text-[15px] leading-relaxed">
                  Los Pinos 2202, Macal 2, El Melón, Nogales, Valparaíso
                </span>
              </li>
            </ul>
            <a href="/api/vcard" download className="mt-10 inline-block">
              <Button variant="outline" className="gap-2 font-body rounded-none border-dona-gold/20 hover:border-dona-gold/50 tracking-wide text-sm">
                <Download className="h-4 w-4" />
                Descargar Contacto (vCard)
              </Button>
            </a>
          </div>
          <div className="rounded-sm overflow-hidden aspect-[4/3] shadow-lg border border-dona-gold/10">
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

      {/* ── Footer ── */}
      <footer className="bg-dona-dark text-white py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
          <LogoWrapper size={56} />
          <div className="text-center">
            <p className="font-heading text-dona-gold font-semibold text-2xl tracking-wider">
              Restaurante Doña Inés
            </p>
            <p className="text-white/30 text-xs uppercase tracking-[0.3em] mt-1 font-body">
              Comida casera con sazón de hogar
            </p>
          </div>
          <QRCodeDisplay
            url="https://restaurante-dona-ines.vercel.app"
            size={140}
            logoSize={36}
            fgColor="#C8A951"
            bgColor="#121212"
          />
          <p className="text-white/25 text-xs font-body tracking-wider uppercase">
            Escanea para visitarnos
          </p>
          <div className="w-12 h-px bg-white/10" />
          <div className="text-center space-y-1">
            <p className="text-white/25 text-xs font-body">
              Los Pinos 2202, Macal 2, El Melón, Nogales, Valparaíso
            </p>
            <p className="text-white/25 text-xs font-body">
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