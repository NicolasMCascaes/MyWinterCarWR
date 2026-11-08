import { COUNTRIES, countryName, guessCountry } from './countries'

describe('countries', () => {
  it('lists every ISO country once, sorted by name', () => {
    const codes = COUNTRIES.map((country) => country.code)
    expect(new Set(codes).size).toBe(codes.length)
    expect(codes).toContain('BR')
    expect(COUNTRIES[0].name.localeCompare(COUNTRIES[1].name)).toBeLessThanOrEqual(0)
  })

  it('names countries in english', () => {
    expect(countryName('br')).toBe('Brazil')
  })

  it('guesses the country from the browser locale', () => {
    expect(guessCountry('pt-BR')).toBe('BR')
    expect(guessCountry('en')).toBe('')
    expect(guessCountry(undefined)).toBe('')
  })
})
