import { useState } from 'react'

import { supabase } from '../supabase/client'

import Logo from '../assets/logo.png'

import Fondo from '../assets/fondo.png'

import toast from 'react-hot-toast'

import {
  Link,
  useNavigate
} from 'react-router-dom'

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {

    e.preventDefault()

    // VALIDACIÓN
    if (
      !email.trim() ||
      !password.trim()
    ) {

      toast.error('Completa todos los campos')

      return

    }

    // LOGIN
    const { error } = await supabase
      .auth
      .signInWithPassword({
        email,
        password
      })

    if (error) {

      console.log(error)

      toast.error(error.message)

      return

    }

    toast('Bienvenid@', { icon: '🤗' })

    navigate('/dashboard')

  }

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        p-6
        relative
      "
    >

      {/* FONDO */}
      <img
        src={Fondo}
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />


      <form
        onSubmit={handleLogin}

        className="
          relative 
          z-10
          bg-white
          p-8
          rounded-2xl
          shadow-lg
          border
          border-gray-200
          w-full
          max-w-md
        "
      >

        {/* LOGO*/}
        <div className="flex flex-col items-center mb-6">
          <div className="w-45 h-45 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-xl shadow-green-100">

            <img
              src={Logo}
              alt="Logo"
              className="w-40 h-40 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mt-5 tracking-wide">
            Indencents CEC
          </h2>
          <p className="text-sm text-gray-400">
            Universidad de la Amazonia
          </p>
        </div>


        {/* TÍTULO */}
        <h1
          className="
            text-2xl
            font-bold
            mb-6
            text-center
            text-gray-800
            mt-5
          "
        >

          Iniciar Sesión

        </h1>

        {/* EMAIL */}
        <input
          type="email"

          placeholder="Correo electrónico"

          className="
            w-full
            border
            p-3
            rounded-xl
            mb-4
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
          "

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* PASSWORD */}
        <input
          type="password"

          placeholder="Contraseña"

          className="
            w-full
            border
            p-3
            rounded-xl
            mb-6
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
          "

          value={password}

          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {/* BOTÓN */}
        <button
          className="
            w-full
            bg-blue-600
            hover:bg-blue-800
            active:scale-95
            transition-all duration-200
            text-white
            text-lg
            p-3
            rounded-xl
            font-bold
            
          "
        >

          Ingresar

        </button>

        {/* REGISTRO */}
        <p className="mt-6 text-center text-gray-600">

          ¿No tienes cuenta?

          <Link
            to="/register"

            className="
              text-blue-600
              ml-4
              font-medium
              hover:underline
            "
          >

            Registrarse

          </Link>

        </p>

      </form>

    </div>

  )

}

export default Login