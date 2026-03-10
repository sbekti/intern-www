"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
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
  CommandIcon,
  LayoutDashboardIcon,
  NetworkIcon,
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
      title: "Devices",
      url: "/networks/devices",
      icon: <SmartphoneNfcIcon />,
    },
    {
      title: "VLANs",
      url: "/networks/vlans",
      icon: <NetworkIcon />,
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
