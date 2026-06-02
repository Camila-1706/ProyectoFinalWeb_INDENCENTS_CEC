import { Link } from 'react-router-dom'
import { supabase } from '../supabase/client'

import toast from 'react-hot-toast'


function IncidentCard({
  incidente,
  obtenerIncidentes,
  rol,
  seleccionados,
  toggleSeleccion
}) {

  // ELIMINAR INCIDENTE
  const eliminarIncidente = async () => {

    // VERIFICAR SI PERTENECE A UN GRUPO CON SOLO 2 INCIDENTES
    if (incidente.grupo) {

      const { data: miembrosGrupo, error: errorGrupo } = await supabase
        .from('incidentes')
        .select('id')
        .eq('grupo', incidente.grupo)

      if (errorGrupo) {
        console.log(errorGrupo)
        toast.error('Error al verificar el grupo')
        return
      }

      if (miembrosGrupo.length <= 2) {
        toast.error(
          `No puedes eliminar este incidente: el grupo "${incidente.grupo}" quedaría con menos de 2 miembros. Desagrupa el grupo primero y luego elimínalo.`,
          { duration: 5000 }
        )
        return
      }

    }
    const confirmar = confirm(
      '¿Seguro que deseas eliminar este incidente?'
    )

    if (!confirmar) return

    const { error } = await supabase
      .from('incidentes')
      .delete()
      .eq('id', incidente.id)

    if (error) {

      console.log(error)

      toast.error('Error al eliminar')

      return

    }

    toast.success('Incidente eliminado')

    obtenerIncidentes()

  }

  // CAMBIAR ESTADO
  const cambiarEstado = async (nuevoEstado) => {

    let query = supabase
      .from('incidentes')
      .update({
        estado: nuevoEstado
      })

    // SI TIENE GRUPO
    if (incidente.grupo) {

      query = query.eq(
        'grupo',
        incidente.grupo
      )

    } else {

      query = query.eq(
        'id',
        incidente.id
      )

    }

    const { error } = await query

    if (error) {

      console.log(error)

      toast.error('Error al actualizar')

      return

    }

    //NOTIFICAR AL USUARIO QUE REPORTÓ EL INCIDENTE
    const { data: { user } } = await supabase.auth.getUser()

    if (incidente.usuario_id !== user.id) {

      await supabase.from('notificaciones').insert([{
        usuario_id: incidente.usuario_id,
        mensaje: `Tu incidente "${incidente.tipo}" en ${incidente.ubicacion} cambió a: ${nuevoEstado}`
      }])

    }

    obtenerIncidentes()

  }

  return (

    <div
      className={`
        bg-white 
        rounded-2xl 
        shadow-xl 
        transition 
        border-3
        overflow-hidden
        border-l-4
  ${seleccionados.includes(incidente.id)
          ? 'border-blue-500 ring-2 ring-blue-300'
          : incidente.estado === 'Reportado'
            ? 'border-l-red-500 border-gray-200'
            : incidente.estado === 'En proceso'
              ? 'border-l-yellow-400 border-gray-200'
              : 'border-l-green-500 border-gray-200'
        }`}>

      {/* HEADER */}
      <div className="flex justify-between items-center px-5 pt-5">

        {/* CHECKBOX SOLO ADMIN */}
        {
          rol === 'admin' ? (

            <label className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={
                  seleccionados.includes(
                    incidente.id
                  )
                }

                onChange={() =>
                  toggleSeleccion(
                    incidente.id
                  )
                }

                className="
                  w-4
                  h-4
                  accent-blue-600
                  cursor-pointer
                "
              />

              <span className="text-sm text-gray-600">

                Seleccionar

              </span>

            </label>

          ) : (

            <div></div>

          )
        }

        {/* ESTADO */}
        <span
          className={`
            text-xs
            font-semibold
            px-3
            py-1
            rounded-full
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

      {/* ZONA CLICKEABLE */}
      <Link to={`/incidente/${incidente.id}`}>

        <div className="p-5 cursor-pointer">

          {/* TITULO */}
          <h2 className="text-lg font-bold text-gray-800 mb-3">

            {incidente.tipo}

          </h2>

          {/* IMAGEN */}
          {
            incidente.imagen_url && (

              <div className="mb-4 overflow-hidden rounded-xl">

                <img
                  src={incidente.imagen_url}
                  alt="Incidente"

                  className="
                    w-full
                    h-48
                    object-cover
                    hover:scale-105
                    transition
                    duration-300
                  "
                />

              </div>

            )
          }

          {/* INFO */}
          <div className="space-y-2 text-sm text-gray-700">

            <p>

              <span className="font-semibold text-gray-900">

                Descripción:

              </span>

              {' '}

              {incidente.descripcion}

            </p>

            <p>

              <span className="font-semibold text-gray-900">

                Ubicación:

              </span>

              {' '}

              {incidente.ubicacion}

            </p>

            {
              incidente.grupo && (

                <p>

                  <span className="font-semibold text-gray-900">

                    Grupo:

                  </span>

                  {' '}

                  <span className="text-purple-600 font-medium">

                    {incidente.grupo}

                  </span>

                </p>

              )
            }

          </div>

        </div>

      </Link>

      {/* BOTONES ADMIN */}
      {
        rol === 'admin' && (

          <div className="px-5 pb-5 flex flex-wrap gap-3">

            <button
              onClick={() =>
                cambiarEstado(
                  'En proceso'
                )
              }

              className="
                bg-yellow-500
                hover:bg-yellow-600
                text-white
                px-4
                py-2
                rounded-lg
                transition
              "
            >
              En proceso
            </button>

            <button
              onClick={() =>
                cambiarEstado(
                  'Resuelto'
                )
              }

              className="
                bg-green-600
                hover:bg-green-700
                text-white
                px-4
                py-2
                rounded-lg
                transition
              "
            >
              Resuelto
            </button>

            <button
              onClick={eliminarIncidente}

              className="
                bg-red-500
                hover:bg-red-600
                text-white
                px-4
                py-2
                rounded-lg
                transition
              "
            >
              Eliminar
            </button>

          </div>

        )
      }

      {/* FECHA */}
      {
        incidente.fecha_creacion && (

          <div className="px-5 pb-5">

            <p className="pt-3 border-t text-sm text-gray-500">

              Fecha:
              {' '}

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

  )

}

export default IncidentCard