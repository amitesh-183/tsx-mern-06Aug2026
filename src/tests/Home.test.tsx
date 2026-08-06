import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import Home from '@/pages/Home'
import type { Character } from '@/types'
import { films, humanSpecies, leia, luke, tatooine } from './fixtures'

vi.mock('@/services/characterService', () => ({
  getCharacters: vi.fn(),
}))
vi.mock('@/services/homeworldService', () => ({
  getPlanet: vi.fn(),
  getAllPlanets: vi.fn(),
}))
vi.mock('@/services/speciesService', () => ({
  getAllSpecies: vi.fn(),
}))
vi.mock('@/services/filmService', () => ({
  getAllFilms: vi.fn(),
}))

import { getCharacters } from '@/services/characterService'
import { getAllSpecies } from '@/services/speciesService'
import { getAllFilms } from '@/services/filmService'
import { getAllPlanets, getPlanet } from '@/services/homeworldService'

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <Home />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

/** Builds a list of distinct characters for pagination tests. */
function makeCharacters(count: number): Character[] {
  return Array.from({ length: count }, (_, index) => ({
    ...luke,
    id: index + 1,
    name: `Character ${index + 1}`,
    url: `https://swapi.info/api/people/${index + 1}/`,
  }))
}

beforeEach(() => {
  vi.mocked(getCharacters).mockResolvedValue([luke, leia])
  vi.mocked(getAllSpecies).mockResolvedValue([humanSpecies])
  vi.mocked(getAllFilms).mockResolvedValue(films)
  vi.mocked(getAllPlanets).mockResolvedValue([tatooine])
  vi.mocked(getPlanet).mockResolvedValue(tatooine)
})

describe('Home', () => {
  it('renders character cards with names and species badges', async () => {
    renderPage()

    expect(
      await screen.findByRole('button', {
        name: /open details for luke skywalker/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /open details for leia organa/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Human').length).toBeGreaterThan(0)
  })

  it('opens the character modal with full details and homeworld info', async () => {
    const user = userEvent.setup()
    renderPage()

    const card = await screen.findByRole('button', {
      name: /open details for luke skywalker/i,
    })
    await user.click(card)

    // Modal opens with the correct character name.
    const dialog = await screen.findByRole('dialog', {
      name: /luke skywalker/i,
    })
    expect(dialog).toBeInTheDocument()
    expect(
      within(dialog).getByRole('heading', { name: 'Luke Skywalker' }),
    ).toBeInTheDocument()

    // Correct details are displayed.
    expect(within(dialog).getByText('1.72 m')).toBeInTheDocument()
    expect(within(dialog).getByText('77 kg')).toBeInTheDocument()
    expect(within(dialog).getByText('19BBY')).toBeInTheDocument()
    expect(within(dialog).getByText('24-12-2014')).toBeInTheDocument()
    expect(within(dialog).getByText('4 films')).toBeInTheDocument()

    // Homeworld data is displayed (fetched on demand).
    expect(await within(dialog).findByText('Tatooine')).toBeInTheDocument()
    expect(within(dialog).getByText('desert')).toBeInTheDocument()
    expect(within(dialog).getByText('arid')).toBeInTheDocument()
    expect(within(dialog).getByText('11 residents')).toBeInTheDocument()
  })

  it('closes the modal when the close button is pressed', async () => {
    const user = userEvent.setup()
    renderPage()

    const card = await screen.findByRole('button', {
      name: /open details for luke skywalker/i,
    })
    await user.click(card)

    await screen.findByRole('dialog', { name: /luke skywalker/i })
    await user.click(
      screen.getByRole('button', { name: /close character details/i }),
    )

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: /luke skywalker/i }),
      ).not.toBeInTheDocument()
    })
  })

  it('paginates client-side and disables Previous on the first page', async () => {
    const user = userEvent.setup()
    vi.mocked(getCharacters).mockResolvedValue(makeCharacters(12))

    renderPage()

    // Wait for the first page of data to resolve before asserting states.
    await screen.findByText('Page 1 of 2')
    expect(
      screen.getByRole('button', { name: 'Open details for Character 1' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: 'Open details for Character 11',
      }),
    ).not.toBeInTheDocument()

    const previousButton = screen.getByRole('button', {
      name: /previous page/i,
    })
    expect(previousButton).toBeDisabled()

    const nextButton = screen.getByRole('button', { name: /next page/i })
    expect(nextButton).toBeEnabled()

    await user.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    })
    expect(
      screen.getByRole('button', { name: 'Open details for Character 11' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /previous page/i })).toBeEnabled()
  })

  it('searches by name after the debounce delay', async () => {
    const user = userEvent.setup()
    renderPage()

    await screen.findByRole('button', {
      name: /open details for luke skywalker/i,
    })

    await user.type(screen.getByRole('searchbox'), 'luk')

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /open details for leia organa/i }),
      ).not.toBeInTheDocument()
    })
    expect(
      screen.getByRole('button', { name: /open details for luke skywalker/i }),
    ).toBeInTheDocument()
  })

  it('scrolls to the top when changing pages', async () => {
    const scrollTo = vi.fn()
    vi.spyOn(window, 'scrollTo').mockImplementation(scrollTo)
    const user = userEvent.setup()
    vi.mocked(getCharacters).mockResolvedValue(makeCharacters(12))

    renderPage()

    await screen.findByText('Page 1 of 2')
    await user.click(screen.getByRole('button', { name: /next page/i }))

    await waitFor(() => {
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    })
    expect(scrollTo).toHaveBeenCalled()

    scrollTo.mockClear()
    await user.click(screen.getByRole('button', { name: /previous page/i }))
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })
    expect(scrollTo).toHaveBeenCalled()
  })

  it('shows a friendly error state with a retry button when the API fails', async () => {
    const user = userEvent.setup()
    vi.mocked(getCharacters).mockRejectedValue(new Error('Network error'))

    renderPage()

    expect(
      await screen.findByRole('heading', {
        name: /unable to reach the galaxy/i,
      }),
    ).toBeInTheDocument()

    const retryButton = screen.getByRole('button', { name: /try again/i })
    vi.mocked(getCharacters).mockResolvedValue([luke])

    await user.click(retryButton)
    expect(
      await screen.findByRole('button', {
        name: /open details for luke skywalker/i,
      }),
    ).toBeInTheDocument()
  })
})
