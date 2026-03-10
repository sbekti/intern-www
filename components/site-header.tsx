"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const titles: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Overview",
    description: "Internal operations, network access, and future home controls.",
  },
  "/profile": {
    title: "Profile",
    description: "Current identity, groups, and SSO-linked account details.",
  },
  "/profile/security": {
    title: "Security",
    description: "Password handoff and session-related actions.",
  },
  "/networks/vlans": {
    title: "VLAN Management",
    description: "Define and review the network segments available to devices.",
  },
  "/networks/devices": {
    title: "Device Management",
    description: "Register MAC addresses and assign the right VLAN.",
  },
  "/auth/device": {
    title: "Device Approval",
    description: "Approve or deny pending login requests from external clients.",
  },
}

export function SiteHeader() {
  const pathname = usePathname()
  const meta = titles[pathname] ?? titles["/"]

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-3 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Intern</BreadcrumbLink>
              </BreadcrumbItem>
              {pathname !== "/" ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{meta.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : null}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="min-w-0">
            <h1 className="truncate text-base font-medium">{meta.title}</h1>
            <p className="truncate text-sm text-muted-foreground">
              {meta.description}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
