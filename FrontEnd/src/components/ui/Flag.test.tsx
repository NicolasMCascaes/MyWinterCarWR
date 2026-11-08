import { render, screen } from '@testing-library/react'
import { SkipLink } from '../layout/SkipLink'
import { Flag } from './Flag'

describe('Flag', () => {
  it('renders the country flag as an image named after the country', () => {
    render(<Flag code="br" />)

    const flag = screen.getByRole('img', { name: 'Brazil' })
    expect(flag.getAttribute('src')).toMatch(/br\.svg/)
  })

  it('falls back to the code when there is no flag file', () => {
    render(<Flag code="ZZ" />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('ZZ')).toBeInTheDocument()
  })

  it('renders nothing without a code', () => {
    const { container } = render(<Flag code={null} />)

    expect(container).toBeEmptyDOMElement()
  })
})

describe('SkipLink', () => {
  it('points to the main content', () => {
    render(<SkipLink />)

    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content')
  })
})
