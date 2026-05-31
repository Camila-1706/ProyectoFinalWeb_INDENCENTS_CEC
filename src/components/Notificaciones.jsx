import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabase/client'

function Notificaciones() {

    const [abierto, setAbierto] = useState(false)
    const [notificaciones, setNotificaciones] = useState([])
    const [cargando, setCargando] = useState(true)
    const panelRef = useRef(null)

    useEffect(() => {

        let canal = null

        const iniciar = async () => {

            obtenerNotificaciones()

            const {
                data: { session }
            } = await supabase.auth.getSession()

            if (!session?.user) return

            const userId = session.user.id

            canal = supabase.channel(
                `notificaciones-${crypto.randomUUID()}`
            )

            canal.on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notificaciones',
                    filter: `usuario_id=eq.${userId}`
                },
                () => {
                    obtenerNotificaciones()
                }
            )

            canal.subscribe()
        }

        iniciar()

        return () => {
            if (canal) {
                supabase.removeChannel(canal)
            }
        }

    }, [])
    // CERRAR PANEL AL HACER CLICK FUERA
    useEffect(() => {
        const handleClickFuera = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setAbierto(false)
            }
        }

        if (abierto) {
            document.addEventListener('mousedown', handleClickFuera)
        }

        return () => document.removeEventListener('mousedown', handleClickFuera)
    }, [abierto])


    const obtenerNotificaciones = async () => {

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase
            .from('notificaciones')
            .select('*')
            .eq('usuario_id', user.id)
            .order('create_at', { ascending: false })
            .limit(20)

        if (error) {
            console.error('Error al obtener notificaciones:', error)
            return
        }

        setNotificaciones(data ?? [])
        setCargando(false)
    }

    // MARCAR NOTIFICACIONES COMO LEÍDAS
    const marcarLeidas = async () => {

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { error } = await supabase
            .from('notificaciones')
            .update({ leida: true })
            .eq('usuario_id', user.id)

        if (error) {
            console.error('Error al marcar como leídas:', error)
            return
        }

        setNotificaciones(prev =>
            prev.map(n => ({ ...n, leida: true }))
        )
    }

    const noLeidas = notificaciones.filter(
        n => n.leida !== true
    ).length

    return (

        <div className="relative" ref={panelRef}>

            {/* CAMPANITA */}
            <button
                onClick={() => setAbierto(!abierto)}
                className="
                relative 
                bg-amber-200 
                text-black
                p-2 
                rounded-full 
                hover:bg-amber-400 transition
                shadow-sm
                "
                aria-label="Notificaciones"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {!cargando && noLeidas > 0 && (
                    <span className="
                    absolute 
                    -top-0.5 -right-0.5 
                    bg-red-500 
                    text-white 
                    text-xs 
                    w-5 h-5 
                    rounded-full 
                    flex 
                    items-center 
                    justify-center 
                    font-bold">
                        {noLeidas > 9 ? '9+' : noLeidas}
                    </span>
                )}
            </button>

            {/* PANEL */}
            {abierto && (

                <div className="
                fixed sm:absolute 
                top-1/2 sm:top-auto 
                left-1/2 sm:left-auto 
                -translate-x-1/2 sm:translate-x-0 
                -translate-y-1/2 sm:translate-y-0
                sm:right-0 
                sm:mt-3 
                w-[90vw] sm:w-96 
                max-w-md
                bg-white 
                rounded-2xl 
                shadow-2xl shadow-amber-200/50
                border border-amber-400 
                z-50 
                overflow-hidden">

                    {/* HEADER */}
                    <div className="
                    px-4 py-3 
                    bg-amber-200 
                    flex 
                    border border-amber-500
                    justify-between 
                    items-center">
                        <div>
                            <h3 className="
                            font-bold 
                            text-gray-900 
                            ">
                                Notificaciones
                            </h3>
                            <p className="text-amber-800 text-xs font-bold mt-0.5">
                                {noLeidas > 0 ? `${noLeidas} sin leer` : 'Todo al día'}
                            </p>
                        </div>

                        {noLeidas > 0 && (
                            <button
                                onClick={marcarLeidas}
                                className="
                                text-xs 
                                bg-white 
                                text-blue-700 
                                font-bold 
                                px-2.5 py-1 
                                rounded-lg 
                                hover:bg-blue-100 transition"
                            >
                                Marcar como leídas
                            </button>
                        )}

                        {/* BOTÓN DE X*/}
                        <button
                            onClick={() => setAbierto(false)}
                            className="sm:hidden p-1 rounded-lg text-amber-900/60 hover:text-amber-900 hover:bg-amber-300/50 transition"
                            aria-label="Cerrar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>

                    </div>

                    <div className="
                    max-h-96 
                    overflow-y-auto 
                    divide-y 
                    divide-gray-100">

                        {cargando ? (

                            <div className="
                            flex items-center 
                            justify-center 
                            py-10 
                            text-gray-400 
                            text-sm">
                                Cargando...
                            </div>

                        ) : notificaciones.length === 0 ? (

                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <svg className="w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <p className="text-sm font-bold">Sin notificaciones</p>
                            </div>

                        ) : (

                            notificaciones.map((n) => (

                                <div
                                    key={n.id}
                                    className={`border-b border-gray-300 px-5 py-4 flex gap-3 items-start transition ${n.leida ? 'bg-white' : 'bg-blue-100'}`}
                                >
                                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.leida ? 'bg-gray-400' : 'bg-blue-600'}`} />

                                    <div className="flex-1">
                                        <p className={`text-sm leading-snug ${n.leida ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                                            {n.mensaje}
                                        </p>
                                        <p className="font-bold text-gray-400 text-xs mt-1">
                                            {new Date(n.create_at).toLocaleString()}
                                        </p>
                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            )}

        </div>

    )

}

export default Notificaciones
