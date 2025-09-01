import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { uploadDocument, listDocuments, runIngestion } from '../store/slices/docsSlice'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

export default function Documents(){
  const dispatch = useAppDispatch()
  const docs = useAppSelector(s=>s.docs.items)
  const token = useAppSelector(s=>s.auth.token) || ''
  const [file, setFile] = useState<File | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(()=>{ if(token) dispatch(listDocuments({token})) }, [token])

  const submit = async (e:React.FormEvent) => {
    e.preventDefault()
    if(!file || !token) { setMsg('Select file and login'); return }
    await dispatch(uploadDocument({file, token})).unwrap()
    setMsg('Uploaded. Refreshing list.')
    await dispatch(listDocuments({token}))
  }

  const handleIngest = async (id:number) => {
    if(!token) return
    const r:any = await dispatch(runIngestion({documentId:id, token})).unwrap()
    setMsg(`Ingested ${r.chunks} chunks.`)
  }

  return (
    <Box>
      <Typography variant="h5">Documents</Typography>
      {msg && <Alert severity="info" sx={{my:2}}>{msg}</Alert>}
      <Box component="form" onSubmit={submit} sx={{my:2, display:'flex', gap:2, alignItems:'center'}}>
        <input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
        <Button type="submit" variant="contained">Upload</Button>
      </Box>
      <Divider sx={{my:2}} />
      <List>
        {docs.map((d:any)=>(
          <ListItem key={d.id} secondaryAction={<Button onClick={()=>handleIngest(d.id)}>Ingest</Button>}>
            <ListItemText primary={d.filename} secondary={`Owner: ${d.owner_id} • ${d.content_type}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
