import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

function RutaProtegida({ children }) {

    const [cargando, setCargando] = useState(true)
    const [sesionActiva, setSesionActiva] = useState(false)

    useEffect(() => {

        supabase.auth.getSession().then(({ data }) => {

            setTimeout(() => {
            setSesionActiva(!!data.session)
            setCargando(false)
        }, 800)
        })

    }, [])

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-500">Verificando sesión...</p>
            </div>
        )
    }

    if (!sesionActiva) {
        return <Navigate to="/" />
    }

    return children

}

export default RutaProtegida