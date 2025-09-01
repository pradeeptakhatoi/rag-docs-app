import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import docsReducer from './slices/docsSlice'
import ragReducer from './slices/ragSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    docs: docsReducer,
    rag: ragReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
