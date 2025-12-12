import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Toast = { id: string; message: string; type: 'success'|'error'|'info' }
type UiState = { loading: boolean; toasts: Toast[] }

const initialState: UiState = { loading: false, toasts: [] }

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload },
    pushToast(state, action: PayloadAction<Toast>) { state.toasts.push(action.payload) },
    removeToast(state, action: PayloadAction<string>) { state.toasts = state.toasts.filter(t => t.id !== action.payload) }
  }
})

export const { setLoading, pushToast, removeToast } = slice.actions
export default slice.reducer
