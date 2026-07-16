'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

interface QRCodeDisplayProps {
  url: string
  size?: number
  logoSrc?: string
  logoSize?: number
  fgColor?: string
  bgColor?: string
  className?: string
}

export default function QRCodeDisplay({
  url,
  size = 200,
  logoSrc = '/logo.png',
  logoSize = 48,
  fgColor = '#1A1A1A',
  bgColor = '#FAF7F2',
  className = '',
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scale = 2 // retina
    const padding = 16
    const totalSize = size * scale

    QRCode.toCanvas(canvas, url, {
      width: totalSize,
      margin: padding / scale,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: 'H',
    }).then(() => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Load logo and draw centered
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const ls = logoSize * scale
        const x = (totalSize - ls) / 2
        const y = (totalSize - ls) / 2
        const r = ls * 0.18 // border radius for logo bg

        // White rounded background behind logo
        const bgPad = 6 * scale
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(x - bgPad, y - bgPad, ls + bgPad * 2, ls + bgPad * 2, r + bgPad)
        ctx.fillStyle = bgColor
        ctx.fill()

        // Gold border ring
        ctx.beginPath()
        ctx.roundRect(x - 3 * scale, y - 3 * scale, ls + 6 * scale, ls + 6 * scale, r + 3 * scale)
        ctx.strokeStyle = '#C9962B'
        ctx.lineWidth = 2.5 * scale
        ctx.stroke()
        ctx.restore()

        // Draw logo with rounded clip
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(x, y, ls, ls, r)
        ctx.clip()
        ctx.drawImage(img, x, y, ls, ls)
        ctx.restore()

        setReady(true)
      }
      img.src = logoSrc
    })
  }, [url, size, logoSrc, logoSize, fgColor, bgColor])

  return (
    <div
      className={`relative inline-flex flex-col items-center gap-3 ${className}`}
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.4s ease' }}
    >
      <div
        className="rounded-2xl overflow-hidden shadow-lg"
        style={{
          width: size,
          height: size,
          padding: 0,
          border: '3px solid #C9962B',
          background: bgColor,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: size, height: size, display: 'block' }}
        />
      </div>
    </div>
  )
}