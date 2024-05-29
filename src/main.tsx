import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter , Navigate, RouterProvider } from 'react-router-dom'
import '@fontsource/roboto'
import Login from './Auth/Login.tsx'
import Register from './Auth/Register.tsx'
import NotFound from './NotFound.tsx'
import './tailwind-directories.css'
import Dashboard from './Dashboard/Index.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/dashboard/:id',
    element: <Dashboard />
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <Navigate to="/404" />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
