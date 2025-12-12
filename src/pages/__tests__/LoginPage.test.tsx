import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../store'
import LoginPage from '../LoginPage'

test('validazione email e password', () => {
  render(<Provider store={store}><LoginPage /></Provider>)
  fireEvent.click(screen.getByText('Login'))
  expect(screen.getByText('Accedi')).toBeInTheDocument()
})
