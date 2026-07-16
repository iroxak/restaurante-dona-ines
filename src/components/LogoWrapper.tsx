'use client'

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
      <img
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
        width: size + 10,
        height: size + 10,
        background: 'radial-gradient(circle, #FFFCF7 0%, #FDF6EC 100%)',
        boxShadow: '0 0 0 2.5px rgba(160, 120, 48, 0.7), 0 3px 12px rgba(0,0,0,0.35)',
      }}
    >
      <img
        src="/logo.png"
        alt={alt}
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  )
}