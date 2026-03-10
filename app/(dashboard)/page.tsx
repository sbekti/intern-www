import { BellRingIcon, CloudSunIcon, ShieldCheckIcon, WorkflowIcon } from "lucide-react"

import { SectionCards } from "@/components/section-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function HomePage() {
  return (
    <>
      <SectionCards />
      <div className="grid gap-4 px-4 lg:px-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="border-border/70 shadow-xs">
          <CardHeader>
            <CardTitle>Welcome to Intern</CardTitle>
            <CardDescription>
              This shell follows the official `dashboard-01` layout model and is
              ready for live API wiring next.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheckIcon />
                Forward auth first
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Browser identity will come from trusted ingress headers, while
                authorization remains server-side in the API.
              </p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <WorkflowIcon />
                Global device scope
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                VLAN and device management are global in v1. Site-aware IoT
                controls stay out of scope for now.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 shadow-xs">
          <CardHeader>
            <CardTitle>Queued next</CardTitle>
            <CardDescription>
              The next frontend step will replace placeholders with live profile,
              dashboard, VLAN, and device data.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
              <CloudSunIcon className="mt-0.5" />
              <div>
                <p className="text-sm font-medium">Weather widget</p>
                <p className="text-sm text-muted-foreground">
                  Hook up the cached Open-Meteo summary from the dashboard API.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
              <BellRingIcon className="mt-0.5" />
              <div>
                <p className="text-sm font-medium">Admin CRUD screens</p>
                <p className="text-sm text-muted-foreground">
                  Use dialogs, tables, and empty states to manage VLANs and
                  device registrations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="px-4 lg:px-6">
        <Empty className="border bg-card shadow-xs">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <WorkflowIcon />
            </EmptyMedia>
            <EmptyTitle>Shared shell is in place</EmptyTitle>
            <EmptyDescription>
              The dashboard frame now matches the product routes. Data fetching,
              tables, forms, and approval flows come next.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </>
  )
}
