import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }
    if (open && !dialog.open) {
      dialog.showModal()
    }
    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      className={cn(
        'm-auto w-[min(92vw,960px)] rounded-2xl border border-border bg-surface p-0 text-text',
        'backdrop:bg-black/70 backdrop:backdrop-blur-sm open:animate-fade-in',
        className,
      )}
    >
      {open && (
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-2xl">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1 text-muted transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
