"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  BadgeInfoIcon,
  CommandIcon,
  LayoutDashboardIcon,
  LockKeyholeIcon,
  NetworkIcon,
  ShieldIcon,
  SmartphoneNfcIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Authenticated User",
    email: "user@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: <ShieldIcon />,
    },
    {
      title: "VLANs",
      url: "/networks/vlans",
      icon: <NetworkIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Security",
      url: "/profile/security",
      icon: <LockKeyholeIcon />,
    },
    {
      title: "Devices",
      url: "/networks/devices",
      icon: <SmartphoneNfcIcon />,
    },
    {
      title: "Device Login",
      url: "/auth/device",
      icon: <BadgeInfoIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Intern</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
