import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Home, ListChecks, Notebook, LayoutDashboard, Settings, User } from "lucide-react"

export default function AppSidebar() {
  return (
    <Sidebar className="bg-gray-100 border-r">
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Mi Aplicación</h2>
      </SidebarHeader>

      <SidebarContent className="p-2 space-y-4">
        <SidebarGroup title="Navegación Principal" className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Inicio
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <ListChecks className="mr-2 h-4 w-4" />
            Tareas
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Notebook className="mr-2 h-4 w-4" />
            Notas
          </Button>
        </SidebarGroup>

        <SidebarGroup title="Proyectos" className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <span className="mr-2">📚</span>
            Escuela
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <span className="mr-2">📄</span>
            Artículos
          </Button>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-gray-600" />
          <div>
            <p className="text-sm font-medium">Usuario Demo</p>
            <p className="text-xs text-gray-500">demo@example.com</p>
          </div>
          <Settings className="ml-auto h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-800" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
