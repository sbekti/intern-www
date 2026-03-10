"use client"

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
  HouseIcon,
  NetworkIcon,
  SmartphoneNfcIcon,
  WaypointsIcon,
} from "lucide-react"

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: <HouseIcon />,
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

type SidebarUser = {
  name: string
  email: string
  avatar: string
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: SidebarUser
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/" />}
            >
              <WaypointsIcon className="size-5!" />
              <span className="text-base font-semibold">Intern</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
