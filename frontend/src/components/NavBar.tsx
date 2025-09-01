import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { logout } from '../store/slices/authSlice'
import Box from '@mui/material/Box'

export default function NavBar(){
  const dispatch = useAppDispatch()
  const email = useAppSelector(s=>s.auth.email)
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          RAG Docs
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">Documents</Button>
        <Button color="inherit" component={RouterLink} to="/qa">Q&A</Button>
        <Button color="inherit" component={RouterLink} to="/admin/users">Users</Button>
        <Box sx={{ml:2, mr:2}}>{email}</Box>
        <Button color="inherit" onClick={()=>dispatch(logout())}>Logout</Button>
      </Toolbar>
    </AppBar>
  )
}
