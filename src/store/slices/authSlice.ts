import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type User = { id: string; email: string; name: string }
type AuthState = { user?: User; token?: string; status: 'idle'|'loading'|'authenticated'|'error'; error?: string }

const initialState: AuthState = { status: 'idle' }

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.status = 'authenticated'
      state.error = undefined
    },
    clearAuth(state) {
      state.user = undefined
      state.token = undefined
      state.status = 'idle'
      state.error = undefined
    },
    setLoading(state) { state.status = 'loading' },
    setError(state, action: PayloadAction<string>) { state.status = 'error'; state.error = action.payload }
  }
})

export const { setAuth, clearAuth, setLoading, setError } = slice.actions
export default slice.reducer
