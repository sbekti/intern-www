"use client"

import type { ReactNode } from "react"

import type { DevicesTab } from "@/components/network-devices-tabs"
import { NetworkDevicesScopeControl } from "@/components/network-devices-tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type NetworkDevicesCardProps = {
  tab: DevicesTab
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function NetworkDevicesCard({
  tab,
  title,
  description,
  action,
  children,
  footer,
}: NetworkDevicesCardProps) {
  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <NetworkDevicesScopeControl tab={tab} />
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {children}
      </CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  )
}
