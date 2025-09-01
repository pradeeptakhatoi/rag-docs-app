import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'

export interface AuthState {
  token: string | null
  email: string | null
  role: string | null
  status: 'idle' | 'loading' | 'failed' | 'succeeded'
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  email: localStorage.getItem('email'),
  role: localStorage.getItem('role'),
  status: 'idle'
}

export const login = createAsyncThunk('auth/login', async (payload: { email: string, password: string }) => {
  const r = await axios.post(`${API}/auth/login`, payload)
  return r.data
})

export const register = createAsyncThunk('auth/register', async (payload: { email: string, password: string, role?: string }) => {
  const r = await axios.post(`${API}/auth/signup`, payload)
  return r.data
})

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null; state.email = null; state.role = null
      localStorage.removeItem('token'); localStorage.removeItem('email'); localStorage.removeItem('role')
    },
    setFromLocal(state) {
      state.token = localStorage.getItem('token')
      state.email = localStorage.getItem('email')
      state.role = localStorage.getItem('role')
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (s) => { s.status = 'loading' })
    builder.addCase(login.fulfilled, (s, a) => {
      s.status = 'succeeded'; s.token = a.payload.access_token; localStorage.setItem('token', a.payload.access_token)
    })
    builder.addCase(register.fulfilled, (s, a) => {
      s.status = 'succeeded'; s.email = a.payload.email; s.role = a.payload.role
      localStorage.setItem('email', a.payload.email); localStorage.setItem('role', a.payload.role)
    })
  }
})

export const { logout, setFromLocal } = slice.actions
export default slice.reducer
