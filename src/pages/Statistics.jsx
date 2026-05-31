import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'

import {

  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend

} from 'recharts'
import KPICard from '../components/KPICard'

function Statistics() {

  const [incidentes, setIncidentes] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    obtenerIncidentes()
  }, [])

  const obtenerIncidentes = async () => {

    const { data, error } = await supabase
      .from('incidentes')
      .select('*')

    if (error) {

      console.log(error)

      return
    }

    setIncidentes(data)
  }


  // KPIs
  const total = incidentes.length

  const reportados = incidentes.filter(
    i => i.estado === 'Reportado'
  ).length

  const proceso = incidentes.filter(
    i => i.estado === 'En proceso'
  ).length

  const resueltos = incidentes.filter(
    i => i.estado === 'Resuelto'
  ).length


  // AGRUPAR POR TIPO
  const tiposMap = {}

  incidentes.forEach((incidente) => {

    const tipo = incidente.tipo

    if (!tiposMap[tipo]) {
      tiposMap[tipo] = 0
    }

    tiposMap[tipo]++

  })

  const tiposData = Object.keys(tiposMap).map((tipo) => ({

    tipo,

    cantidad: tiposMap[tipo]

  }))

  // DATA PIE
  const estadosData = [

    {
      name: 'Reportados',
      value: reportados
    },

    {
      name: 'En proceso',
      value: proceso
    },

    {
      name: 'Resueltos',
      value: resueltos
    }

  ]

  const COLORS = [

    '#ef4444',
    '#eab308',
    '#22c55e'

  ]

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-gray-100
        to-gray-200
        p-6

        print:bg-white
        print:p-2
      "
    >
      {/* HEADER */}
      <header
        className="
          flex
          flex-col
          md:flex-row
          justify-between
          items-center
          gap-5
          mb-10
          
          print:mb-4
        "
      >

        <div>


          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="
            text-black-500
            bg-gray-200
            font-bold
            rounded-full
            hover:bg-blue-300
            text-xl
            transition-all
            p-2
            shadow-xl
            print:hidden
          "
            >
              {"< Volver"}
            </button>

            <h1
              className="
              text-5xl
              font-black
              text-gray-800
              tracking-tight

              print:text-3xl
            "
            >
              Estadísticas Globales
            </h1>

          </div>

          <p
            className="
              text-gray-500
              mt-3
              text-lg
              ml-30
              print:text-sm
            "
          >
            Panel analítico de incidentes
          </p>

          {/*IMPRESIÓN */}
          <p
            className="
              hidden
              print:block
              text-gray-600
              mt-2
            "
          >

            Reporte generado automáticamente
            por el sistema de incidentes

          </p>

          <p
            className="
              hidden
              print:block
              text-sm
              text-gray-500
              mt-1
            "
          >

            Fecha:
            {' '}
            {new Date().toLocaleDateString()}

          </p>

        </div>

        {/* BOTÓN */}
        <button

          onClick={() => window.print()}

          className="
            flex items-center gap-2
            bg-black
            hover:bg-gray-800
            transition
            text-white
            px-6
            py-3
            rounded-2xl
            shadow-xl
            font-semibold
            print:hidden
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Imprimir reporte
        </button>

      </header>

      {/* KPIS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-6
          mb-12
        "
      >

        {/* TOTAL */}

        <KPICard
          title="Total de Incidentes"
          value={total}
          className="bg-white text-gray-800 border border-gray-200"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20 ">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>

          }
        />

        {/* REPORTADOS */}
        <KPICard
          title="Reportados"
          value={reportados}
          className="bg-gradient-to-br from-red-500 to-red-700 text-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>

          }
        />

        {/* EN PROCESO */}
        <KPICard
          title="En proceso"
          value={proceso}
          className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>

          }
        />

        {/* RESUELTOS */}
        <KPICard
          title="Resueltos"
          value={resueltos}
          className="bg-gradient-to-br from-green-500 to-green-700 text-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>

          }
        />
      </div>

      {/* GRÁFICOS */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-8

          print:grid-cols-1
        "
      >

        {/* BARRAS */}
        <div
          className="
            bg-white
            rounded-3xl
            p-8

            shadow-2xl
            border
            border-gray-100

            print:shadow-none

            break-inside-avoid
            print:break-inside-avoid

            chart-section
          "
        >

          <div className="mb-8">

            <h2
              className="
                text-3xl
                font-black
                text-gray-800
              "
            >

              Incidentes por Tipo

            </h2>

            <p className="text-gray-500 mt-2">

              Distribución por categoría

            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={500}
          >

            <BarChart

              data={tiposData}

              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 90
              }}
            >

              <XAxis

                dataKey="tipo"

                angle={-15}

                textAnchor="end"

                interval={0}

                height={100}

                tick={{
                  fontSize: 15,
                }}
              />

              <YAxis />

              <Tooltip

                formatter={(value) => [
                  `${value} incidentes`,
                  'Cantidad'
                ]}

                contentStyle={{
                  borderRadius: '15px',
                  border: 'none',
                  boxShadow:
                    '0 10px 30px rgba(0,0,0,0.15)'
                }}
              />

              <Bar

                dataKey="cantidad"

                fill="#1857e0"

                radius={[12, 12, 0, 0]}

              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* PIE */}
        <div
          className="
            bg-white
            rounded-3xl
            p-8

            shadow-2xl
            border
            border-gray-100

            print:shadow-none

            break-inside-avoid
            print:break-inside-avoid

            chart-section
          "
        >

          <div className="mb-8">

            <h2
              className="
                text-3xl
                font-black
                text-gray-800
              "
            >

              Incidentes por Estado

            </h2>

            <p className="text-gray-500 mt-2">

              Estado actual de los reportes

            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={500}
          >

            <PieChart>

              <Pie

                data={estadosData}

                dataKey="value"

                nameKey="name"

                outerRadius={150}

                label={({ name, value }) =>
                  `${name}: ${value}`
                }

              >

                {estadosData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />

                ))}

              </Pie>

              <Tooltip

                formatter={(value, name) => [

                  `${value} incidentes`,

                  name

                ]}

                contentStyle={{
                  borderRadius: '15px',
                  border: 'none',
                  boxShadow:
                    '0 10px 30px rgba(0,0,0,0.15)'
                }}
              />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  )
}

export default Statistics