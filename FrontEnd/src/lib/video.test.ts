import { isAllowedVideoLink, toEmbed } from './video'

describe('isAllowedVideoLink', () => {
  it.each([
    'https://www.youtube.com/watch?v=abc123',
    'https://youtu.be/abc123',
    '  https://m.youtube.com/watch?v=abc123  ',
    'https://www.twitch.tv/videos/123456',
    'https://clips.twitch.tv/SomeClip',
  ])('accepts %s', (link) => {
    expect(isAllowedVideoLink(link)).toBe(true)
  })

  it.each([
    '',
    'youtu.be/abc',
    'ftp://youtube.com/x',
    'https://youtube.com.evil.com/watch?v=x',
    'https://vimeo.com/1',
    'javascript:alert(1)',
  ])('rejects %s', (link) => {
    expect(isAllowedVideoLink(link)).toBe(false)
  })
})

describe('toEmbed', () => {
  it('builds youtube embeds from watch, short and shorts links', () => {
    const expected = 'https://www.youtube-nocookie.com/embed/abc123'
    expect(toEmbed('https://www.youtube.com/watch?v=abc123')?.embedUrl).toBe(expected)
    expect(toEmbed('https://youtu.be/abc123')?.embedUrl).toBe(expected)
    expect(toEmbed('https://youtube.com/shorts/abc123')?.embedUrl).toBe(expected)
  })

  it('builds twitch embeds with the parent host', () => {
    expect(toEmbed('https://www.twitch.tv/videos/123', 'localhost')?.embedUrl).toBe(
      'https://player.twitch.tv/?video=123&parent=localhost&autoplay=false',
    )
    expect(toEmbed('https://clips.twitch.tv/Funny', 'localhost')?.embedUrl).toBe(
      'https://clips.twitch.tv/embed?clip=Funny&parent=localhost',
    )
    expect(toEmbed('https://www.twitch.tv/streamer/clip/Funny', 'localhost')?.embedUrl).toBe(
      'https://clips.twitch.tv/embed?clip=Funny&parent=localhost',
    )
  })

  it('returns null for unsupported links', () => {
    expect(toEmbed('https://vimeo.com/1')).toBeNull()
    expect(toEmbed('https://www.youtube.com/feed')).toBeNull()
  })
})
