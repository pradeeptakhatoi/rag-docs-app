import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import Dashboard from './pages/Dashboard'
import DocumentsPage from './pages/Documents'
import QA from './pages/QA'
import AdminUsers from './pages/AdminUsers'
import { useAppSelector } from './hooks'

function RequireAuth({children}:{children:JSX.Element}){
  const token = useAppSelector(s=>s.auth.token)
  if(!token) return <Navigate to="/login" replace />
  return children
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/" element={<RequireAuth><Dashboard/></RequireAuth>}>
        <Route index element={<DocumentsPage/>} />
        <Route path="qa" element={<QA/>} />
        <Route path="admin/users" element={<AdminUsers/>} />
      </Route>
    </Routes>
  )
}
