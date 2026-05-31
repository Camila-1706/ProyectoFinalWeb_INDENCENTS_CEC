import { BrowserRouter, Routes, Route } from 'react-router-dom'

import RutaProtegida from './components/ProtectedRoute'

import Login from './pages/Login'

import Register from './pages/Register'

import Dashboard from './pages/Dashboard'

import CrearIncidente from './pages/CrearIncidente'

import IncidentDetails from './pages/IncidentDetails'

import Statistics from './pages/Statistics'

import NotFound from './pages/NotFound'

import { Toaster } from 'react-hot-toast'


function App() {

  return (
    <>

      <BrowserRouter>

        <Routes>

          {/* LOGIN */}
          <Route
            path="/"
            element={<Login />}
          />

          {/* REGISTRO */}
          <Route
            path="/register"
            element={<Register />}
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={<RutaProtegida><Dashboard /></RutaProtegida>}
          />

          {/* CREAR INCIDENTE */}
          <Route
            path="/crear"
            element={<RutaProtegida><CrearIncidente /></RutaProtegida>}
          />

          {/* DETALLE INCIDENTE */}
          <Route
            path="/incidente/:id"
            element={<RutaProtegida><IncidentDetails /></RutaProtegida>}
          />
          {/* Las ESTASDISTICAS */}
          <Route
            path="/estadisticas"
            element={<RutaProtegida><Statistics /></RutaProtegida>}
          />

          <Route path="*" element={<NotFound />} />
          <Route path="/not-found" element={<NotFound />} />

        </Routes>

      </BrowserRouter>

      <Toaster position="top-center" />

    </>

  )

}

export default App