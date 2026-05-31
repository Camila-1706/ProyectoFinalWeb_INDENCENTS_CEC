import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Fondo from '../assets/fondo.png'

const NotFound = () => {

  const [seg, setSeg] = useState(5)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setSeg(seg - 1)
      if (seg === 1) {
        navigate(-1)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [seg])

  return (

    <div className="relative min-h-screen flex items-center justify-center p-6">

      <img
        src={Fondo}
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-md w-full flex flex-col items-center text-center">

        <p className="text-9xl font-black text-gray-800 select-none leading-none mb-4">
          404
        </p>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Página no encontrada
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Serás redirigido en <span className="text-blue-600 font-bold">{seg}</span> segundo{seg !== 1 ? 's' : ''}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-bold py-3 rounded-xl"
        >
          Volver ahora
        </button>

      </div>

    </div>

  )

}

export default NotFound