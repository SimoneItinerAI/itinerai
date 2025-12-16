import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
jest.mock('../../services/authApi', () => ({
  useLoginMutation: () => [jest.fn(), { isLoading: false }]
}))
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../../store'
import LoginPage from '../LoginPage'

test('validazione email e password', () => {
  render(<Provider store={store}><MemoryRouter initialEntries={['/login']}><LoginPage /></MemoryRouter></Provider>)
  fireEvent.click(screen.getByText('Login'))
  expect(screen.getByText('Accedi')).toBeInTheDocument()
})
