import Link from "next/link"
import { PlusSquare, MoreHorizontal, Plus } from "lucide-react"

export default function Proyectos() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-medium text-[#5a3d2b] mb-8">Proyectos</h1>

      <Link
        href="/nuevo-proyecto"
        className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-[#5a3d2b] mb-10 hover:bg-gray-50 transition-colors"
      >
        <PlusSquare className="h-5 w-5 text-red-400" />
        Añadir proyecto
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Proyecto 1 */}
        <Link href="/dashboard/projects/1" className="group">
          <div className="rounded-2xl p-8 h-44 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 hover:shadow-sm transition-shadow">
            <h2 className="text-xl font-medium text-center text-[#5a3d2b]">
              Rebranding
              <br />
              corrillos.es
            </h2>
          </div>
        </Link>

        {/* Proyecto 2 */}
        <Link href="/dashboard/projects/2" className="group">
          <div className="rounded-2xl p-8 h-44 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 hover:shadow-sm transition-shadow">
            <h2 className="text-xl font-medium text-center text-[#5a3d2b]">
              Plan proyecto
              <br />
              interdisciplinario
            </h2>
          </div>
        </Link>

        {/* Proyecto 3 */}
        <div className="relative group">
          <Link href="/dashboard/projects/3">
            <div className="rounded-2xl p-8 h-44 flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-sm transition-shadow">
              <h2 className="text-xl font-medium text-center text-[#5a3d2b]">
                Proceso de diseño
                <br />
                web
              </h2>
            </div>
          </Link>
          <button className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Proyecto 4 */}
        <Link href="/dashboard/projects/4" className="group">
          <div className="rounded-2xl p-8 h-44 flex items-center justify-center bg-gray-50 hover:shadow-sm transition-shadow">
            <h2 className="text-xl font-medium text-center text-[#5a3d2b]">Proyecto 2</h2>
          </div>
        </Link>

        {/* Añadir proyecto (alternativo) */}
        <Link href="/nuevo-proyecto" className="group">
          <div className="rounded-2xl p-8 h-44 flex items-center justify-center bg-white border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
            <Plus className="h-10 w-10 text-red-400" />
          </div>
        </Link>
      </div>
    </main>
  )
}

