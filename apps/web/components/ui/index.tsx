import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

// ─── Button ────────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary:   'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
      secondary: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700',
      outline:   'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      ghost:     'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400',
      danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    }
    const sizes = { sm: 'text-xs px-3 py-2', md: 'text-sm px-5 py-3', lg: 'text-base px-7 py-4' }

    return (
      <button ref={ref} disabled={disabled || loading} className={cn(base, variants[variant], sizes[size], className)} {...props}>
        {loading && <span className="mr-2 w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

// ─── Badge ─────────────────────────────────────────────────────────────────
interface BadgeProps { label: string; variant?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' }
const badgeVariants = {
  blue:   'bg-blue-100 text-blue-700',
  green:  'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red:    'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-700',
  gray:   'bg-gray-100 text-gray-600',
}
export function Badge({ label, variant = 'gray' }: BadgeProps) {
  return <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize', badgeVariants[variant])}>{label}</span>
}

// ─── Input ─────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}
export function Input({ label, error, helperText, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-1">
      {label && <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700">{label}</label>}
      <input
        id={inputId}
        className={cn(
          'w-full border rounded-xl px-4 py-3 text-sm transition outline-none',
          error ? 'border-red-400 focus:ring-2 focus:ring-red-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-400">{helperText}</p>}
    </div>
  )
}

// ─── Modal ─────────────────────────────────────────────────────────────────
import { X } from 'lucide-react'

interface ModalProps { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string }
export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className={cn('bg-white rounded-2xl w-full shadow-2xl', maxWidth)} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── Skeleton ──────────────────────────────────────────────────────────────
interface SkeletonProps { className?: string }
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('bg-gray-200 rounded-xl animate-pulse', className)} />
}

export function SkeletonCard() {
  return (
    <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    </div>
  )
}

// ─── ConfirmDialog ─────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  loading?: boolean
}
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false, loading }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} className="flex-1" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
