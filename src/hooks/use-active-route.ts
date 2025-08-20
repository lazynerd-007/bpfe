"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ROUTES } from "@/lib/constants"

export function useActiveRoute() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActiveRoute = (route: string): boolean => {
    if (!mounted) {
      return false
    }

    if (route === ROUTES.DASHBOARD) {
      return pathname === "/"
    }
    
    return pathname.startsWith(route)
  }

  return { isActiveRoute, pathname }
}