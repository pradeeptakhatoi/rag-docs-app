import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useAppDispatch } from '../hooks'
import { register } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'

export default function Signup() {
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(register({ email, password, role })).unwrap()
      nav('/login')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Signup failed')
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1 }}><LockOutlinedIcon /></Avatar>
        <Typography component="h1" variant="h5">Sign up</Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
        </Box>
      </Box>
    </Container>
  )
}
