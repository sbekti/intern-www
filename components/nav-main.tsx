"use client"

import Link from "next/link"
import type { MouseEvent } from "react"
import { usePathname, useRouter } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname()
  const router = useRouter()

  function isItemActive(url: string) {
    return url === "/"
      ? pathname === url
      : pathname === url || pathname.startsWith(`${url}/`)
  }

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, url: string) {
    if (!isItemActive(url)) {
      return
    }

    event.preventDefault()
    router.refresh()
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isItemActive(item.url)}
                render={<Link href={item.url} onClick={(event) => handleNavClick(event, item.url)} />}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
