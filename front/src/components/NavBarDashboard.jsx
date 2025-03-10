import IconoInteractivo from "./IconoInteractivo"
import SearchBar from "./SearchBar"
import FechaActual from "./ui/FechaActual"

const NavBarDashboard = () => {
    return(
        <div className="mt-7 ml-[50px]  mb-[76px] mr-9 flex flex-row justify-between">
            <SearchBar/>
            <FechaActual/>
            <div className="flex flex-row gap-12 items-center text-secondary-content">
                <IconoInteractivo tipo="mensajes"/>
                <IconoInteractivo tipo="notificaciones"/>
                <IconoInteractivo tipo="fotoPerfil"/>
            </div>
        </div>
    )
}

export default NavBarDashboard