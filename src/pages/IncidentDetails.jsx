import { useEffect, useState } from 'react'

import {
  useParams,
  useNavigate
} from 'react-router-dom'

import { supabase } from '../supabase/client'

function IncidentDetails() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [incidente, setIncidente] = useState(null)

  // CARGAR INCIDENTE
  useEffect(() => {

    obtenerIncidente()

  }, [id])

  const obtenerIncidente = async () => {

    const { data, error } = await supabase
      .from('incidentes')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      navigate('/not-found', { replace: true })
      return
    }

    setIncidente(data)

  }

  // LOADING
  if (!incidente) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <p className="text-gray-700 text-lg">

          Cargando incidente...

        </p>

      </div>

    )

  }

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div
        className="
          bg-white
          rounded-3xl
          shadow-2xl
          overflow-hidden
          max-w-5xl
          w-full
          grid
          md:grid-cols-2
        "
      >

        {/* IMAGEN */}
        <div className="h-full bg-gray-200">

          {
            incidente.imagen_url ? (

              <img
                src={incidente.imagen_url}

                alt="Incidente"

                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              <div
                className="
                  w-full
                  h-full
                  flex
                  items-center
                  justify-center
                  text-gray-500
                  text-lg
                "
              >
                Sin imagen
              </div>

            )
          }

        </div>

        {/* INFORMACIÓN */}
        <div className="p-8 flex flex-col justify-between">

          <div>

            {/* HEADER */}
            <div className="flex justify-between items-start mb-6 gap-4">

              <h1 className="text-3xl font-bold text-gray-800">

                {incidente.tipo}

              </h1>

              {/* ESTADO */}
              <span
                className={`
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-semibold
                  text-white

                  ${incidente.estado === 'Reportado'
                    ? 'bg-red-500'
                    : incidente.estado === 'En proceso'
                      ? 'bg-yellow-500'
                      : 'bg-green-600'
                  }
                `}
              >

                {incidente.estado}

              </span>

            </div>

            {/* DETALLES */}
            <div className="space-y-6 text-gray-700">

              {/* DESCRIPCIÓN */}
              <div>

                <h2 className="font-bold text-gray-900 mb-2">

                  Descripción

                </h2>

                <p className="leading-relaxed">

                  {incidente.descripcion}

                </p>

              </div>

              {/* UBICACIÓN */}
              <div>

                <h2 className="font-bold text-gray-900 mb-2">

                  Ubicación

                </h2>

                <p>

                  {incidente.ubicacion}

                </p>

              </div>

              {/* GRUPO */}
              {
                incidente.grupo && (

                  <div>

                    <h2 className="font-bold text-gray-900 mb-2">

                      Grupo

                    </h2>

                    <p className="text-purple-600 font-medium">

                      {incidente.grupo}

                    </p>

                  </div>

                )
              }

              {/* FECHA */}
              {
                incidente.fecha_creacion && (

                  <div>

                    <h2 className="font-bold text-gray-900 mb-2">

                      Fecha de creación

                    </h2>

                    <p>

                      {
                        new Date(
                          incidente.fecha_creacion
                        ).toLocaleString()
                      }

                    </p>

                  </div>

                )
              }

            </div>

          </div>

          {/* BOTÓN */}
          <button
            onClick={() => navigate(-1)}

            className="
              mt-8
              bg-gray-900
              hover:bg-black
              transition
              text-white
              py-3
              rounded-xl
              font-semibold
            "
          >
            Volver
          </button>

        </div>

      </div>

    </div>

  )

}

export default IncidentDetails