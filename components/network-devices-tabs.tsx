"use client"

import { useRouter } from "next/navigation"
import { MonitorSmartphoneIcon, RadioTowerIcon, WaypointsIcon } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type DevicesTab = "managed" | "observed" | "locations"

export function NetworkDevicesTabs({ tab }: { tab: DevicesTab }) {
  const router = useRouter()

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        router.push(`/networks/devices?tab=${value}`)
      }}
    >
      <TabsList variant="line" className="w-full justify-start">
        <TabsTrigger value="managed">
          <MonitorSmartphoneIcon data-icon="inline-start" />
          Managed
        </TabsTrigger>
        <TabsTrigger value="observed">
          <RadioTowerIcon data-icon="inline-start" />
          Observed
        </TabsTrigger>
        <TabsTrigger value="locations">
          <WaypointsIcon data-icon="inline-start" />
          Locations
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
