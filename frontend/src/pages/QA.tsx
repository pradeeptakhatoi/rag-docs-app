import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { askQuestion, clear } from '../store/slices/ragSlice'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

export default function QA(){
  const dispatch = useAppDispatch()
  const token = useAppSelector(s=>s.auth.token) || ''
  const answer = useAppSelector(s=>s.rag.answer)
  const sources = useAppSelector(s=>s.rag.sources)
  const [q, setQ] = useState('')

  const submit = async (e:React.FormEvent) => {
    e.preventDefault()
    if(!token) return
    await dispatch(askQuestion({question:q, token}))
  }

  return (
    <Box>
      <Typography variant="h5">Ask a question</Typography>
      <Box component="form" onSubmit={submit} sx={{my:2, display:'flex', gap:2}}>
        <TextField fullWidth label="Question" value={q} onChange={e=>setQ(e.target.value)} />
        <Button type="submit" variant="contained">Ask</Button>
        <Button type="button" variant="outlined" onClick={()=>dispatch(clear())}>Clear</Button>
      </Box>
      {answer && (
        <Card sx={{mt:2}}>
          <CardContent>
            <Typography variant="subtitle1">Answer</Typography>
            <Typography variant="body1" sx={{whiteSpace:'pre-wrap'}}>{answer}</Typography>
          </CardContent>
        </Card>
      )}
      <List>
        {sources.map((s:any)=>(
          <ListItem key={`${s.document_id}-${s.chunk_id}`}>
            <ListItemText primary={`Document ${s.document_id} • Chunk ${s.chunk_id}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
