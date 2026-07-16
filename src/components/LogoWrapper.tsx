'use client'

import Image from 'next/image'

interface LogoWrapperProps {
  size?: number
  className?: string
  alt?: string
  /** 'light' = for dark backgrounds (adds cream circle), 'none' = no wrapper */
  variant?: 'light' | 'none'
}

export default function LogoWrapper({
  size = 40,
  className = '',
  alt = 'Doña Inés',
  variant = 'light',
}: LogoWrapperProps) {
  if (variant === 'none') {
    return (
      <Image
        src="/logo.png"
        alt={alt}
        width={size}
        height={size}
        className={`object-contain ${className}`}
      />
    )
  }

  return (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: size + 8,
        height: size + 8,
        background: 'radial-gradient(circle, #FFFFFF 0%, #FAF7F2 100%)',
        boxShadow: '0 0 0 2px rgba(201, 150, 43, 0.6), 0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      <Image
        src="/logo.png"
        alt={alt}
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  )
}