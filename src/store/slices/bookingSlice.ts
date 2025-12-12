import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type BookingDraft = {
  destination?: string
  start_date?: string
  end_date?: string
  travelers_count?: number
  budget?: 'economico'|'medio'|'comfort'
  pace?: 'tranquillo'|'equilibrato'|'intenso'
  interests?: string[]
  notes?: string
}

type BookingState = { draft: BookingDraft; resources: string[] }

const initialState: BookingState = { draft: {}, resources: [] }

const slice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setDraft(state, action: PayloadAction<BookingDraft>) { state.draft = action.payload },
    setResources(state, action: PayloadAction<string[]>) { state.resources = action.payload },
    reset(state) { state.draft = {}; state.resources = [] }
  }
})

export const { setDraft, setResources, reset } = slice.actions
export default slice.reducer
