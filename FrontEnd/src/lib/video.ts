export type VideoProvider = 'youtube' | 'twitch'

export interface VideoEmbed {
  provider: VideoProvider
  embedUrl: string
}

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'])
const TWITCH_HOSTS = new Set(['twitch.tv', 'www.twitch.tv', 'm.twitch.tv', 'clips.twitch.tv'])

function parseUrl(link: string): URL | null {
  try {
    const url = new URL(link.trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

export function isAllowedVideoLink(link: string): boolean {
  const url = parseUrl(link)
  if (!url) {
    return false
  }
  const host = url.hostname.toLowerCase()
  return YOUTUBE_HOSTS.has(host) || TWITCH_HOSTS.has(host)
}

function youtubeId(url: URL): string | null {
  if (url.hostname.toLowerCase() === 'youtu.be') {
    return url.pathname.slice(1) || null
  }
  const fromQuery = url.searchParams.get('v')
  if (fromQuery) {
    return fromQuery
  }
  const [, kind, id] = url.pathname.split('/')
  return kind === 'shorts' || kind === 'embed' || kind === 'live' ? (id ?? null) : null
}

function twitchEmbed(url: URL, parent: string): string | null {
  const host = url.hostname.toLowerCase()
  const segments = url.pathname.split('/').filter(Boolean)
  if (host === 'clips.twitch.tv' && segments[0]) {
    return `https://clips.twitch.tv/embed?clip=${segments[0]}&parent=${parent}`
  }
  if (segments[1] === 'clip' && segments[2]) {
    return `https://clips.twitch.tv/embed?clip=${segments[2]}&parent=${parent}`
  }
  if (segments[0] === 'videos' && segments[1]) {
    return `https://player.twitch.tv/?video=${segments[1]}&parent=${parent}&autoplay=false`
  }
  if (segments[0]) {
    return `https://player.twitch.tv/?channel=${segments[0]}&parent=${parent}&autoplay=false`
  }
  return null
}

export function toEmbed(link: string, parent: string = window.location.hostname): VideoEmbed | null {
  const url = parseUrl(link)
  if (!url) {
    return null
  }
  const host = url.hostname.toLowerCase()
  if (YOUTUBE_HOSTS.has(host)) {
    const id = youtubeId(url)
    return id ? { provider: 'youtube', embedUrl: `https://www.youtube-nocookie.com/embed/${id}` } : null
  }
  if (TWITCH_HOSTS.has(host)) {
    const embedUrl = twitchEmbed(url, parent)
    return embedUrl ? { provider: 'twitch', embedUrl } : null
  }
  return null
}
