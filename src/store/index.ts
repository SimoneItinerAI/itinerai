import { configureStore } from '@reduxjs/toolkit'
import { api } from '../services/api'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import dashboardReducer from './slices/dashboardSlice'
import bookingReducer from './slices/bookingSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    booking: bookingReducer
  },
  middleware: (getDefault) => getDefault().concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
