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

  const [verPassword, setVerPassword] = useState(false)

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
        <div className="relative mb-6">
          <input
            type={verPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setVerPassword(!verPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {verPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        </div>

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