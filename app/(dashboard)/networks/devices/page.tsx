import { ForbiddenState, UnauthorizedState } from "@/components/api-state"
import { DeviceManager } from "@/components/device-manager"
import { NetworkDevicesTabs } from "@/components/network-devices-tabs"
import { ObservationPointManager } from "@/components/observation-point-manager"
import { ObservedPresencePanel } from "@/components/observed-presence-panel"
import { TableLoadingPanel } from "@/components/loading-panels"
import {
  listDevices,
  listObservedPresenceClients,
  listPresenceObservationPoints,
  listVlans,
} from "@/lib/api"
import { createPageMetadata } from "@/lib/page-titles"
import { hasForcedGlimmer } from "@/lib/utils"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

type DevicesTab = "managed" | "observed" | "locations"

const defaultPageSize = 25
const allowedPageSizes = [25, 50, 100, 200] as const

export const metadata = createPageMetadata("/networks/devices")

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = params[key]
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }
  return value ?? ""
}

function parsePageSize(value: string) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed)) {
    return defaultPageSize
  }
  if (allowedPageSizes.includes(parsed as (typeof allowedPageSizes)[number])) {
    return parsed
  }
  return defaultPageSize
}

function parseOffset(value: string) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }
  return parsed
}

function parseTab(value: string): DevicesTab {
  switch (value) {
    case "observed":
      return "observed"
    case "locations":
      return "locations"
    default:
      return "managed"
  }
}

export default async function DevicesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams

  if (hasForcedGlimmer(params)) {
    return <TableLoadingPanel titleWidth="w-20" />
  }

  const tab = parseTab(readParam(params, "tab"))

  if (tab === "managed") {
    const [devices, vlans] = await Promise.all([listDevices(), listVlans()])

    if (!devices.ok) {
      if (devices.status === 403) {
        return <ForbiddenState />
      }

      return <UnauthorizedState />
    }

    if (!vlans.ok) {
      if (vlans.status === 403) {
        return <ForbiddenState />
      }

      return <UnauthorizedState />
    }

    return (
      <div className="grid gap-4 px-4 lg:px-6">
        <NetworkDevicesTabs tab={tab} />
        <DeviceManager initialItems={devices.data.items} vlans={vlans.data.items} />
      </div>
    )
  }

  if (tab === "observed") {
    const q = readParam(params, "q")
    const status = readParam(params, "status")
    const sourceType = readParam(params, "source_type")
    const sourceKey = readParam(params, "source_key")
    const medium = readParam(params, "medium")
    const location = readParam(params, "location")
    const limit = parsePageSize(readParam(params, "limit"))
    const offset = parseOffset(readParam(params, "offset"))

    const observedClients = await listObservedPresenceClients({
      q,
      status,
      source_type: sourceType,
      source_key: sourceKey,
      medium,
      location,
      limit,
      offset,
    })

    if (!observedClients.ok) {
      if (observedClients.status === 403) {
        return <ForbiddenState />
      }

      return <UnauthorizedState />
    }

    return (
      <div className="grid gap-4 px-4 lg:px-6">
        <NetworkDevicesTabs tab={tab} />
        <ObservedPresencePanel
          items={observedClients.data.items}
          pagination={observedClients.data.pagination}
          filters={{
            q,
            status,
            source_type: sourceType,
            source_key: sourceKey,
            medium,
            location,
          }}
        />
      </div>
    )
  }

  const q = readParam(params, "q")
  const sourceType = readParam(params, "source_type")
  const sourceKey = readParam(params, "source_key")
  const medium = readParam(params, "medium")
  const limit = parsePageSize(readParam(params, "limit"))
  const offset = parseOffset(readParam(params, "offset"))

  const observationPoints = await listPresenceObservationPoints({
    q,
    source_type: sourceType,
    source_key: sourceKey,
    medium,
    limit,
    offset,
  })

  if (!observationPoints.ok) {
    if (observationPoints.status === 403) {
      return <ForbiddenState />
    }

    return <UnauthorizedState />
  }

  return (
    <div className="grid gap-4 px-4 lg:px-6">
      <NetworkDevicesTabs tab={tab} />
      <ObservationPointManager
        items={observationPoints.data.items}
        pagination={observationPoints.data.pagination}
        filters={{
          q,
          source_type: sourceType,
          source_key: sourceKey,
          medium,
        }}
      />
    </div>
  )
}
