import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../store'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'

test('redirect se non autenticato', () => {
  render(<Provider store={store}><MemoryRouter><ProtectedRoute /></MemoryRouter></Provider>)
})
