import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

import IncidentCard from '../components/IncidentCard'

import GrupoCard from '../components/GrupoCard'

import Notificaciones from '../components/Notificaciones'

import toast from 'react-hot-toast'

function Dashboard() {

  const navigate = useNavigate()

  const [incidentes, setIncidentes] = useState([])

  const [rol, setRol] = useState(null)

  const [filtro, setFiltro] = useState('Todos')

  const [seleccionados, setSeleccionados] = useState([])

  const [grupos, setGrupos] = useState([])

  const [showScrollTop, setShowScrollTop] = useState(false)

  const [menuAbierto, setMenuAbierto] = useState(false)

  const headerRef = useRef(null)

  // CARGA INICIAL
  useEffect(() => {

    obtenerRol()

  }, [])

  // DETECTA EL SCROLL PARA MOSTRAR EL BOTON DE SUBIR AL INICIO
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // CUANDO CAMBIA ROL O FILTRO
  useEffect(() => {

    if (rol !== null) {

      obtenerIncidentes()

      obtenerGrupos()

    }

  }, [rol, filtro])

  // DETECTAR CLICK FUERA DEL HEADER PARA CERRAR EL MENÚ RESPONSIVE
  useEffect(() => {
    const handleClickFueraMenu = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuAbierto(false)
      }
    }

    if (menuAbierto) {
      document.addEventListener('mousedown', handleClickFueraMenu)
    }

    return () => document.removeEventListener('mousedown', handleClickFueraMenu)
  }, [menuAbierto])

  // OBTENER INCIDENTES
  const obtenerIncidentes = async () => {

    const usuario = await supabase.auth.getUser()

    let query = supabase
      .from('incidentes')
      .select('*')

    // SI NO ES ADMIN SOLO VE LOS SUYOS
    if (rol !== 'admin') {

      query = query.eq(
        'usuario_id',
        usuario.data.user.id
      )

    }

    // FILTRO
    if (filtro !== 'Todos') {

      const estados = [
        'Reportado',
        'En proceso',
        'Resuelto'
      ]

      if (estados.includes(filtro)) {

        query = query.eq(
          'estado',
          filtro
        )

      } else {

        query = query.eq(
          'grupo',
          filtro
        )

      }

    }

    const { data, error } = await query

    if (error) {

      console.log(error)

      return

    }

    setIncidentes(data)

  }

  const obtenerGrupos = async () => {

    const { data, error } = await supabase
      .from('incidentes')
      .select('*')
      .not('grupo', 'is', null)

    if (error) {

      console.log(error)

      return

    }

    // AGRUPAR MANUALMENTE
    const gruposMap = {}

    data.forEach((incidente) => {

      if (!gruposMap[incidente.grupo]) {

        gruposMap[incidente.grupo] = {
          nombre: incidente.grupo,
          total: 0,
          estado: incidente.estado,
          imagenes: []
        }

      }
      if (incidente.imagen_url && gruposMap[incidente.grupo].imagenes.length < 3) {
        gruposMap[incidente.grupo].imagenes.push(incidente.imagen_url)
      }

      gruposMap[incidente.grupo].total++

    })

    setGrupos(
      Object.values(gruposMap)
    )

  }

  // OBTENER ROL
  const obtenerRol = async () => {

    const usuario = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', usuario.data.user.id)
      .maybeSingle()

    if (error) {

      console.log(error)

      return

    }

    if (data) {

      setRol(data.rol)

    } else {

      setRol('usuario')

    }

  }

  // LOGOUT
  const handleLogout = async () => {

    const confirmar = confirm('¿Seguro que deseas cerrar sesión?')

    if (!confirmar) return

    await supabase.auth.signOut()

    navigate('/')

  }

  //VOLVER AL INICIO
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // SELECCIONAR INCIDENTES
  const toggleSeleccion = (id) => {

    if (seleccionados.includes(id)) {

      setSeleccionados(
        seleccionados.filter(
          item => item !== id
        )
      )

    } else {

      setSeleccionados([
        ...seleccionados,
        id
      ])

    }

  }

  // CREAR GRUPO
  const crearGrupo = async () => {

    if (seleccionados.length < 2) {

      toast.error(
        'Selecciona al menos 2 incidentes'
      )

      return

    }

    const nombre = prompt(
      'Nombre del grupo'
    )

    if (!nombre) return

    const { error } = await supabase
      .from('incidentes')
      .update({
        grupo: nombre
      })
      .in('id', seleccionados)

    if (error) {

      console.log(error)

      toast.error('Error al crear grupo')

      return

    }

    toast.success('Grupo creado correctamente')

    setSeleccionados([])

    obtenerIncidentes()
    obtenerGrupos()

  }

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <header
        ref={headerRef}
        className="
          bg-white
          shadow-2xl
          rounded-2xl
          p-6
          mb-8
          flex flex-col 
          md:flex-row 
          justify-between 
          md:items-center 
          gap-4 
          relative">

        <div className='flex
          justify-between
          items-center
          w-full
          md:w-auto
          '>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard de Incidentes
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestión y seguimiento de reportes
            </p>
          </div>

          {/*BOTÓN DE 3 BARRITAS*/}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            aria-label="Menú"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/*CONTENEDOR DE BOTONES*/}
        <div className={`
            ${menuAbierto ? 'flex' : 'hidden'} 
            md:flex 
            flex-col md:flex-row 
            items-center md:justify-end
            gap-3 flex-wrap 
            max-md:absolute 
            max-md:top-full 
            max-md:right-6 
            max-md:bg-white 
            max-md:z-40 
            max-md:p-4 
            max-md:rounded-2xl 
            max-md:shadow-xl 
            max-md:border max-md:border-gray-100 
            max-md:mt-2
            md:static md:w-auto 
            md:bg-transparent md:p-0 
            md:shadow-none 
            md:border-none
          `}>
          {rol === 'admin' && (
            <button
              onClick={crearGrupo}

              className="
                  bg-purple-600
                  hover:bg-purple-700
                  transition
                  text-white
                  px-5
                  py-2
                  rounded-xl
                  shadow-sm
                  w-fit
                "
            >
              Agrupar seleccionados
            </button>
          )
          }
          <button
            onClick={() => navigate('/crear')}

            className="
              bg-blue-600
              hover:bg-blue-700
              transition
              text-white
              px-5
              py-2
              rounded-xl
              shadow-sm
              w-fit
            "
          >
            + Crear incidente
          </button>

          <button
            onClick={() => navigate('/estadisticas')}

            className="
              bg-indigo-600
              hover:bg-indigo-700
              transition
              text-white
              px-5
              py-2
              rounded-xl
              w-fit
            "
          >
            Ver estadísticas
          </button>

          <Notificaciones />

          <button
            onClick={handleLogout}

            className="
              bg-red-500
              hover:bg-red-600
              transition
              text-white
              px-5
              py-2
              rounded-xl
              shadow-sm
              w-fit
            "
          >
            Cerrar sesión
          </button>

        </div>

      </header>

      {/* CONTADOR */}
      {
        seleccionados.length > 0 && rol === 'admin' && (

          <div
            className="
              mb-6
              bg-blue-100
              text-blue-700
              px-5
              py-3
              rounded-2xl
              font-semibold
            "
          >
            {seleccionados.length}
            {seleccionados.length == 1 ? ' incidente seleccionado' : ' incidentes seleccionados'}

          </div>

        )
      }

      {/* FILTROS */}
      <div
        className="
          bg-white
          shadow-xl
          rounded-2xl
          p-4
          mb-8
          flex
          flex-wrap
          gap-3
        "
      >

        <button
          onClick={() => setFiltro('Todos')}

          className={`px-4 py-2 rounded-full transition ${filtro === 'Todos'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Todos
        </button>

        <button
          onClick={() => setFiltro('Reportado')}

          className={`px-4 py-2 rounded-full transition ${filtro === 'Reportado'
            ? 'bg-red-600 text-white'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
        >
          Reportados
        </button>

        <button
          onClick={() => setFiltro('En proceso')}

          className={`px-4 py-2 rounded-full transition ${filtro === 'En proceso'
            ? 'bg-yellow-500 text-white'
            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
        >
          En proceso
        </button>

        <button
          onClick={() => setFiltro('Resuelto')}

          className={`px-4 py-2 rounded-full transition ${filtro === 'Resuelto'
            ? 'bg-green-600 text-white'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
        >
          Resueltos
        </button>

      </div>

      {grupos.length > 0 && (

        <div className="mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Grupos de incidentes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {grupos.map((grupo) => (

              <GrupoCard
                key={grupo.nombre}
                grupo={grupo}
                rol={rol}
                setFiltro={setFiltro}
                onActualizar={() => {
                  obtenerIncidentes()
                  obtenerGrupos()
                }}
              />

            ))}

          </div>

        </div>

      )}

      {/* GRID */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >

        {
          incidentes.length === 0 ? (

            <div
              className="
                col-span-full
                text-center
                text-gray-500
                py-10
              "
            >
              No hay incidentes para mostrar
            </div>

          ) : (

            incidentes.map((incidente, index) => (

              <div
                key={incidente.id}

                className="
                  transform
                  hover:scale-[1.02]
                  transition
                  animate-slide-up
                "
                style={{ animationDelay: `${index * 60}ms` }}
              >

                <IncidentCard
                  incidente={incidente}
                  obtenerIncidentes={obtenerIncidentes}
                  rol={rol}
                  seleccionados={seleccionados}
                  toggleSeleccion={toggleSeleccion}
                />

              </div>

            ))

          )
        }

      </div>

      {/* BOTÓN FLOTANTE PARA SUBIR AL INICIO */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="
          fixed bottom-6 right-6 
          md:bottom-20 
          md:right-8 
          bg-blue-900 
          hover:bg-blue-600 
          text-white 
          w-10 
          h-10 
          md:w-14 
          md:h-14 
          rounded-full 
          shadow-[0_0_20px_#3b82f6] 
          shadow-blue-500 
          flex
          items-center 
          justify-center 
          text-2xl
          border-2 
          border-white
          md:text-3xl 
          transition-all duration-300
          hover:scale-110 
          active:scale-95 
          z-50"
        >
          ↑
        </button>
      )}

    </div>



  )

}

export default Dashboard
