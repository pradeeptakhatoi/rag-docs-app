import React, { useEffect } from 'react'
import { useAppSelector } from '../hooks'
import axios from 'axios'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function AdminUsers(){
  const token = useAppSelector(s=>s.auth.token) || ''
  const [users, setUsers] = React.useState<any[]>([])

  useEffect(()=>{
    if(!token) return
    axios.get(`${import.meta.env.VITE_API_BASE}/users/`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>setUsers(r.data)).catch(()=>{})
  }, [token])

  return (
    <div>
      <Typography variant="h5">Users (Admin only)</Typography>
      <List>
        {users.map(u=>(
          <ListItem key={u.id}>
            <ListItemText primary={u.email} secondary={`Role: ${u.role}`} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}
