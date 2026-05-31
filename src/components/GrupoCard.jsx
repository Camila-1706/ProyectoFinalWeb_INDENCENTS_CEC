import { supabase } from '../supabase/client'

import toast from 'react-hot-toast'

function GrupoCard({ grupo, rol, setFiltro, onActualizar }) {

    const desagrupar = async () => {

        const confirmar = confirm(
            `¿Desagrupar todos los incidentes del grupo "${grupo.nombre}"?`
        )

        if (!confirmar) return

        const { error } = await supabase
            .from('incidentes')
            .update({ grupo: null })
            .eq('grupo', grupo.nombre)

        if (error) {
            toast.error('Error al desagrupar')
            return
        }

        onActualizar()

    }

    return (

        <div
            onClick={() => setFiltro(grupo.nombre)}
            className="
            bg-white 
            p-6 
            rounded-2xl 
            shadow-md 
            hover:shadow-xl 
            transition 
            cursor-pointer 
            border 
            flex 
            flex-col md:flex-row
            justify-between 
            items-center
            w-full
            gap-5"
            
        >

            <div>

                <h3 className="text-lg font-bold text-purple-700 mb-4">
                    {grupo.nombre}
                </h3>

                <p className="text-gray-600">
                    {grupo.total} incidentes
                </p>

                <p className="mt-2">
                    Estado: <span className="font-semibold">{grupo.estado}</span>
                </p>

                {rol === 'admin' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            desagrupar()
                        }}
                        className="mt-6 text-sm bg-purple-100 hover:bg-purple-300 text-purple-600 font-semibold px-2 py-2 rounded-xl transition"
                    >
                        Desagrupar
                    </button>
                )}

            </div>

            {/* BARAJA DE IMÁGENES*/}
            {grupo.imagenes?.length > 0 && (

                <div className="relative flex-shrink-0 w-32 h-37 max-md:mt-4 max-md:ml-6">

                    {grupo.imagenes.map((url, i) => {

                        const rotaciones = [-24, -8, 8, 24];
                        const desplazamiento = [-14, -5, 5, 14];

                        return (

                            <img
                                key={i}
                                src={url}
                                className="
                                absolute w-32 h-37
                                rounded-xl 
                                object-cover 
                                shadow-lg 
                                border-2 
                                border-white 
                                transition-all 
                                duration-300 
                                hover:scale-115 
                                hover:-translate-y-4 
                                hover:rotate-0 
                                hover:z-50"
                                style={{
                                    rotate: `${rotaciones[i]}deg`,
                                    left: `${desplazamiento[i] * 2}px`,
                                    zIndex: i
                                }}

                                onMouseEnter={(e) => e.currentTarget.style.zIndex = 99}
                                onMouseLeave={(e) => e.currentTarget.style.zIndex = i}
                            />


                        )

                    })}

                </div>

            )}

        </div>

    )

}

export default GrupoCard