import type { ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getProfile } from "@/lib/api"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const profile = await getProfile()

  if (!profile.ok) {
    throw new Error("Required authenticated profile unavailable for dashboard shell.")
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={{
          name: profile.data.name,
          email: profile.data.email,
          avatar: "",
        }}
        isAdmin={profile.data.is_admin}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:py-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
