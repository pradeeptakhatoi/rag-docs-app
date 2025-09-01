import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Container from '@mui/material/Container'

export default function Dashboard(){
  return (
    <div>
      <NavBar />
      <Container sx={{mt:3}}>
        <Outlet />
      </Container>
    </div>
  )
}
