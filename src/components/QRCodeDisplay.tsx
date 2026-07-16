'use client'

import { useEffect, useState } from 'react'
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
  const [qrSrc, setQrSrc] = useState('')

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: size * 2,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: 'H',
    }).then(setQrSrc)
  }, [url, size, fgColor, bgColor])

  if (!qrSrc) return null

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ border: '3px solid #C9962B' }}
      >
        <img
          src={qrSrc}
          alt="Código QR"
          width={size}
          height={size}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      </div>
      {/* Logo overlay centered */}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: logoSize + 12,
          height: logoSize + 12,
          background: '#FFFFFF',
          border: '2.5px solid #C9962B',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}
      >
        <img
          src={logoSrc}
          alt="Doña Inés"
          width={logoSize}
          height={logoSize}
          className="rounded-full object-contain p-0.5"
        />
      </div>
    </div>
  )
}