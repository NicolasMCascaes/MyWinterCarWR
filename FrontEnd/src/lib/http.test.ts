import { ApiError, configureHttp, http } from './http'

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

describe('http', () => {
  const fetchMock = vi.fn<typeof fetch>()
  const onUnauthorized = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    onUnauthorized.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    configureHttp({ getToken: () => 'token-123', onUnauthorized })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the bearer token and json body', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }))

    const result = await http.post<{ ok: boolean }>('/attempt/submit', { a: 1 })

    expect(result).toEqual({ ok: true })
    const [, init] = fetchMock.mock.calls[0]
    const headers = new Headers(init?.headers)
    expect(headers.get('Authorization')).toBe('Bearer token-123')
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(init?.body).toBe('{"a":1}')
  })

  it('returns undefined for empty successful responses', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }))
    await expect(http.patch('/attempt/moderator/accept/1')).resolves.toBeUndefined()
  })

  it('converts ErrorInfo into ApiError', async () => {
    fetchMock.mockResolvedValue(jsonResponse(409, { errorMessage: 'Already pending', errorCode: 409 }))

    await expect(http.get('/x')).rejects.toEqual(new ApiError('Already pending', 409))
    expect(onUnauthorized).not.toHaveBeenCalled()
  })

  it('notifies unauthorized responses when a token was sent', async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { errorMessage: 'Unauthorized', errorCode: 401 }))

    await expect(http.get('/x')).rejects.toBeInstanceOf(ApiError)
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })
})
