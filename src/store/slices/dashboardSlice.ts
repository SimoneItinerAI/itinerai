import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Metric = { key: string; value: number }
type DashboardState = { metrics: Metric[]; realtime: Record<string, any> }

const initialState: DashboardState = { metrics: [], realtime: {} }

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setMetrics(state, action: PayloadAction<Metric[]>) { state.metrics = action.payload },
    updateRealtime(state, action: PayloadAction<{ key: string; value: any }>) { state.realtime[action.payload.key] = action.payload.value }
  }
})

export const { setMetrics, updateRealtime } = slice.actions
export default slice.reducer
