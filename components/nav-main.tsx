"use client"

import Link from "next/link"
import type { MouseEvent } from "react"
import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { LoaderCircleIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
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
  const [isPending, startTransition] = React.useTransition()
  const [refreshingUrl, setRefreshingUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!isPending) {
      setRefreshingUrl(null)
    }
  }, [isPending])

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
    setRefreshingUrl(url)
    startTransition(() => {
      router.refresh()
    })
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
              {refreshingUrl === item.url ? (
                <SidebarMenuBadge aria-live="polite" aria-label={`Refreshing ${item.title}`}>
                  <LoaderCircleIcon className="animate-spin" />
                </SidebarMenuBadge>
              ) : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
