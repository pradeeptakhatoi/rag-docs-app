import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'

export const askQuestion = createAsyncThunk('rag/ask', async ({question, token, documentIds}:{question:string, token:string, documentIds?:number[]}) => {
  const r = await axios.post(`${API}/rag/qa`, { question, document_ids: documentIds }, { headers: { Authorization: `Bearer ${token}` } })
  return r.data
})

const slice = createSlice({
  name:'rag',
  initialState:{ answer: null as null | string, sources: [] as any[], status:'idle' },
  reducers:{ clear(state){ state.answer = null; state.sources = [] } },
  extraReducers:(b)=>{
    b.addCase(askQuestion.fulfilled,(s,a)=>{ s.answer = a.payload.answer; s.sources = a.payload.sources; s.status='succeeded' })
  }
})

export const { clear } = slice.actions
export default slice.reducer
