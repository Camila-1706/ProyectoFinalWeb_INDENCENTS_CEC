import { useState } from 'react'
import { supabase } from '../supabase/client'

import { useNavigate } from 'react-router-dom'

import Fondo from '../assets/fondo.png'

import toast from 'react-hot-toast'

function CrearIncidente() {

    const [tipo, setTipo] = useState('')

    const [descripcion, setDescripcion] = useState('')

    const [ubicacion, setUbicacion] = useState('')

    const [imagen, setImagen] = useState(null)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {

        e.preventDefault()

        // OBTENER USUARIO
        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {

            toast('Debes iniciar sesión')

            return

        }

        // VALIDACIONES
        if (
            !tipo.trim() ||
            !descripcion.trim() ||
            !ubicacion.trim()
        ) {

            toast.error('Completa todos los campos')

            return

        }

        if (descripcion.length < 10) {

            toast.error(
                'La descripción debe tener mínimo 10 caracteres'
            )

            return

        }

        if (!imagen) {

            toast.error('Debes seleccionar una imagen')

            return

        }

        // SUBIR IMAGEN
        let imagenUrl = ''

        const nombreArchivo = `${Date.now()}-${imagen.name}`

        const { error: errorStorage } = await supabase
            .storage
            .from('imagenes-incidentes')
            .upload(nombreArchivo, imagen)

        if (errorStorage) {

            console.log(errorStorage)

            toast.error('Error subiendo imagen')

            return

        }

        const { data } = supabase
            .storage
            .from('imagenes-incidentes')
            .getPublicUrl(nombreArchivo)

        imagenUrl = data.publicUrl

        // GUARDAR INCIDENTE
        const { error } = await supabase
            .from('incidentes')
            .insert([
                {
                    usuario_id: user.id,
                    tipo,
                    descripcion,
                    ubicacion,
                    estado: 'Reportado',
                    imagen_url: imagenUrl
                }
            ])

        if (error) {

            console.log(error)

            toast.error('Error al guardar')

            return

        }

        toast.success('Incidente registrado correctamente')

        //NOTIFICAR AL ADMIN DEL NUEVO INCIDENTE
        const { data: adminData } = await supabase
            .from('perfiles')
            .select('id')
            .eq('rol', 'admin')
            .maybeSingle()

        // SOLO NOTIFICA SI EXISTE UN ADMIN Y EL USUARIO NO ES EL ADMIN
        if (adminData && adminData.id !== user.id) {

            await supabase.from('notificaciones').insert([{
                usuario_id: adminData.id,
                mensaje: `Nuevo incidente reportado: ${tipo} en ${ubicacion}`
            }])

        }

        navigate('/dashboard')

        // LIMPIAR FORMULARIO
        setTipo('')

        setDescripcion('')

        setUbicacion('')

        setImagen(null)

    }

    return (

        <main className="relative min-h-screen p-6 overflow-x-hidden">

            {/* FONDO*/}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `url(${Fondo})`,
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: '100% auto'
                }}
            />

            {/* BOTÓN VOLVER*/}
            <button
                onClick={() => navigate('/dashboard')}
                className="
                fixed top-6 left-10 z-50 flex items-center gap-2 text-blue-700 font-semibold hover:bg-blue-100 transition-all bg-white px-4 py-2 rounded-2xl shadow-xl"

            >
                {"< Volver al Dashboard"}
            </button>

            <div className="relative max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10 pt-15">

                <h1 className="text-3xl font-bold mb-2">

                    Reportar un nuevo incidente
                </h1>

                <p className="text-gray-400 mb-10">
                    Completa todos los campos para registrar un nuevo reporte
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                        <div className="flex flex-col gap-6">

                            {/* TIPO */}
                            <div>
                                <label className="
                                text-xs 
                                font-semibold 
                                text-gray-600 
                                tracking-widest 
                                mb-2 block">
                                    TIPO DE INCIDENTE*
                                </label>

                                <select
                                    className="w-full border-2 border-purple-800 p-3 rounded mb-4"

                                    onChange={(e) =>
                                        setTipo(e.target.value)
                                    }

                                    value={tipo}
                                    required
                                >

                                    <option value="">
                                        Seleccionar
                                    </option>

                                    <option value="Electricidad">
                                        Electricidad
                                    </option>

                                    <option value="Infraestructura">
                                        Infraestructura
                                    </option>

                                    <option value="Seguridad">
                                        Seguridad
                                    </option>

                                    <option value="Baños">
                                        Baños
                                    </option>

                                </select>
                            </div>

                            {/* DESCRIPCIÓN */}
                            <div className=''>
                                <label className="
                                text-xs 
                                font-semibold 
                                text-gray-600 
                                tracking-widest 
                                mb-2 block
                                mt-6
                                ">

                                    DESCRIPCIÓN*
                                </label>
                                <textarea
                                    placeholder="Describe detalladamente el incidente..."

                                    className="
                                        w-full
                                        border-2
                                        border-purple-800
                                        p-3
                                        rounded
                                        mb-4
                                        resize-none
                                    "

                                    rows={7}

                                    onChange={(e) =>
                                        setDescripcion(e.target.value)
                                    }

                                    value={descripcion}
                                    required
                                />

                            </div>



                        </div>

                        <div className="flex flex-col">

                            {/* UBICACIÓN */}
                            <div>
                                <label className="text-xs 
                                font-semibold 
                                text-gray-600 
                                tracking-widest 
                                mb-2 block"
                                >
                                    UBICACIÓN*
                                </label>

                                <input
                                    type="text"

                                    placeholder="Ej: Bloque 2, salon 2204"

                                    className="
                                        w-full
                                        border-2
                                        border-purple-800
                                        p-3
                                        rounded
                                        mb-4
                                        mb-10
                                    "

                                    onChange={(e) =>
                                        setUbicacion(e.target.value)
                                    }

                                    value={ubicacion}
                                    required
                                />
                            </div>

                            {/* IMAGEN */}
                            <div>
                                <label className="
                                text-xs 
                                font-semibold 
                                text-gray-600 
                                tracking-widest 
                                mb-2 block">
                                    FOTOGRAFÍA*
                                </label>

                                <div
                                    onClick={() => document.getElementById('fileInput').click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const file = e.dataTransfer.files[0];
                                        if (file && file.type.startsWith('image/')) {
                                            setImagen(file);
                                        } else {
                                            toast.error('Solo se permiten imágenes');
                                        }
                                    }}
                                    className={`border-2 border-dashed rounded-2xl h-72 flex items-center justify-center text-center cursor-pointer transition-all
                                        ${imagen
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-purple-800 hover:border-blue-500 hover:bg-blue-50'}`}
                                >
                                    {imagen ? (
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={URL.createObjectURL(imagen)}
                                                alt="Vista previa"
                                                className="w-45 h-45 object-cover rounded-xl shadow-md"
                                            />
                                            <p className="text-green-600 font-medium mt-3 text-sm truncate max-w-48">{imagen.name}</p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImagen(null);
                                                }}
                                                className="mt-3 text-red-500 text-sm hover:underline"
                                            >
                                                Quitar imagen
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-3xl">
                                                📷
                                            </div>
                                            <p className="font-medium text-gray-700">Arrastra la imagen aquí</p>
                                            <p className="text-sm text-gray-500 mt-1">o haz clic para seleccionar</p>
                                        </div>
                                    )}
                                </div>

                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) setImagen(file);
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                    {/* BOTÓN GUARDAR*/}
                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            className="
                                bg-blue-600
                                hover:bg-blue-800 hover: shadow-xl
                                transition
                                text-white
                                p-4
                                rounded-xl
                                font-semibold
                                "
                        >
                            Guardar Incidente
                        </button>
                    </div>

                </form>
            </div>
        </main>

    )

}

export default CrearIncidente