"use client"

import { useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type DevicesTab = "managed" | "observed" | "locations"

export function buildDevicesHref(tab: DevicesTab) {
  if (tab === "managed") {
    return "/networks/devices"
  }

  return `/networks/devices?tab=${tab}`
}

export function NetworkDevicesScopeControl({ tab }: { tab: DevicesTab }) {
  const router = useRouter()

  function navigate(nextTab: DevicesTab) {
    router.push(buildDevicesHref(nextTab))
  }

  return (
    <>
      <div className="lg:hidden">
        <Select
          value={tab}
          onValueChange={(value) =>
            navigate(
              value === "observed"
                ? "observed"
                : value === "locations"
                  ? "locations"
                  : "managed"
            )
          }
          items={[
            { label: "Managed", value: "managed" },
            { label: "Observed", value: "observed" },
            { label: "Locations", value: "locations" },
          ]}
        >
          <SelectTrigger size="sm" className="w-full min-w-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="managed">Managed</SelectItem>
              <SelectItem value="observed">Observed</SelectItem>
              <SelectItem value="locations">Locations</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ToggleGroup
        value={[tab]}
        onValueChange={(value) => {
          const nextValue = value[0]

          if (!nextValue) {
            return
          }

          navigate(
            nextValue === "observed"
              ? "observed"
              : nextValue === "locations"
                ? "locations"
                : "managed"
          )
        }}
        variant="outline"
        size="sm"
        className="hidden lg:flex"
      >
        <ToggleGroupItem value="managed" aria-label="Show managed devices">
          Managed
        </ToggleGroupItem>
        <ToggleGroupItem value="observed" aria-label="Show observed devices">
          Observed
        </ToggleGroupItem>
        <ToggleGroupItem value="locations" aria-label="Show device locations">
          Locations
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  )
}
