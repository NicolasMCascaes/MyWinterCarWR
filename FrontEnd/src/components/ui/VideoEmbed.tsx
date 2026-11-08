import { ExternalLink, VideoOff } from 'lucide-react'
import { cn } from '../../lib/cn'
import { toEmbed } from '../../lib/video'

interface VideoEmbedProps {
  link: string
  title: string
  className?: string
}

export function VideoEmbed({ link, title, className }: VideoEmbedProps) {
  const embed = toEmbed(link)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-bg-deep">
        {embed ? (
          <iframe
            src={embed.embedUrl}
            title={title}
            className="absolute inset-0 size-full"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
            <VideoOff className="size-10" aria-hidden />
            <p>This video cannot be embedded.</p>
          </div>
        )}
      </div>
      <a
        href={link}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1.5 self-end text-sm text-muted transition-colors hover:text-white"
      >
        Open original <ExternalLink className="size-4" aria-hidden />
      </a>
    </div>
  )
}
