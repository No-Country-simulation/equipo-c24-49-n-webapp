'use client'
import { usePathname } from "next/navigation";
const BeePatern = () => {
    const pathname = usePathname();

    if (pathname === "/dashboard") {
      return null; // No renderiza nada si estamos en /dashboard
    }
  return (
    <div className="absolute w-full bottom-0 -z-10 overflow-hidden pointer-events-none">
          <img src="/bee-pattern.svg" className="w-full object-cover" />
        </div>
  )
}

export default BeePatern