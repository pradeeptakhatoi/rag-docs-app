import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'

export const uploadDocument = createAsyncThunk('docs/upload', async ({file, token}:{file:File, token:string}) => {
  const form = new FormData()
  form.append('file', file)
  const r = await axios.post(`${API}/documents/upload`, form, { headers: { Authorization: `Bearer ${token}` } })
  return r.data
})

export const listDocuments = createAsyncThunk('docs/list', async ({token}:{token:string}) => {
  const r = await axios.get(`${API}/documents/`, { headers: { Authorization: `Bearer ${token}` } })
  return r.data
})

export const runIngestion = createAsyncThunk('docs/ingest', async ({documentId, token}:{documentId:number, token:string}) => {
  const r = await axios.post(`${API}/ingestion/run/${documentId}`, null, { headers: { Authorization: `Bearer ${token}` } })
  return r.data
})

const slice = createSlice({
  name:'docs',
  initialState:{ items:[], status:'idle' },
  reducers:{},
  extraReducers:(b)=>{
    b.addCase(uploadDocument.fulfilled,(s,a)=>{ s.items.push(a.payload) })
    b.addCase(listDocuments.fulfilled,(s,a)=>{ s.items = a.payload })
  }
})

export default slice.reducer
