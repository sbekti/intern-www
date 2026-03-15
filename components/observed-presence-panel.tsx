"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RadarIcon } from "lucide-react"

import type {
  ObservedPresenceClient,
  PresencePagination,
} from "@/lib/api"
import { mediumLabel, sourceTypeLabel, statusLabel } from "@/lib/presence"
import { LocalTimestamp } from "@/components/local-timestamp"
import { TablePagination } from "@/components/table-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const allowedPageSizes = [25, 50, 100, 200] as const

type ObservedFilters = {
  q: string
  status: string
  source_type: string
  source_key: string
  medium: string
  location: string
}

const statusItems = [
  { label: "Any status", value: "all" },
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
]

const sourceTypeItems = [
  { label: "Any source", value: "all" },
  { label: "RADIUS", value: "radius" },
  { label: "UniFi", value: "unifi" },
  { label: "Juniper SNMP", value: "juniper-snmp" },
]

const mediumItems = [
  { label: "Any medium", value: "all" },
  { label: "Wi-Fi", value: "wireless" },
  { label: "Wired", value: "wired" },
]

function normalizeFilterValue(value: string) {
  return value === "all" ? "" : value
}

function buildObservedHref(
  filters: ObservedFilters,
  pagination: { limit: number; offset: number }
) {
  const params = new URLSearchParams()

  params.set("tab", "observed")
  params.set("limit", String(pagination.limit))
  params.set("offset", String(pagination.offset))

  for (const [key, rawValue] of Object.entries(filters)) {
    if (!rawValue) {
      continue
    }
    params.set(key, rawValue)
  }

  return `/networks/devices?${params.toString()}`
}

export function ObservedPresencePanel({
  items,
  pagination,
  filters,
}: {
  items: ObservedPresenceClient[]
  pagination: PresencePagination
  filters: ObservedFilters
}) {
  const router = useRouter()
  const [draftFilters, setDraftFilters] = useState(filters)

  useEffect(() => {
    setDraftFilters(filters)
  }, [filters])

  const pageStart = pagination.total === 0 ? 0 : pagination.offset + 1
  const pageEnd = Math.min(pagination.offset + items.length, pagination.total)

  return (
    <div className="grid gap-4">
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Search by MAC, managed name, location, or observation point.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault()
              router.push(
                buildObservedHref(draftFilters, {
                  limit: pagination.limit,
                  offset: 0,
                })
              )
            }}
          >
            <FieldGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="observed-q">Search</FieldLabel>
                <Input
                  id="observed-q"
                  value={draftFilters.q}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      q: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="observed-status">Status</FieldLabel>
                <Select
                  value={draftFilters.status || "all"}
                  onValueChange={(value) =>
                    setDraftFilters((current) => ({
                      ...current,
                      status: normalizeFilterValue(value ?? "all"),
                    }))
                  }
                  items={statusItems}
                >
                  <SelectTrigger id="observed-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statusItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="observed-medium">Medium</FieldLabel>
                <Select
                  value={draftFilters.medium || "all"}
                  onValueChange={(value) =>
                    setDraftFilters((current) => ({
                      ...current,
                      medium: normalizeFilterValue(value ?? "all"),
                    }))
                  }
                  items={mediumItems}
                >
                  <SelectTrigger id="observed-medium" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {mediumItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="observed-source-type">Source Type</FieldLabel>
                <Select
                  value={draftFilters.source_type || "all"}
                  onValueChange={(value) =>
                    setDraftFilters((current) => ({
                      ...current,
                      source_type: normalizeFilterValue(value ?? "all"),
                    }))
                  }
                  items={sourceTypeItems}
                >
                  <SelectTrigger id="observed-source-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sourceTypeItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="observed-source-key">Source Key</FieldLabel>
                <Input
                  id="observed-source-key"
                  value={draftFilters.source_key}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      source_key: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="observed-location">Location</FieldLabel>
                <Input
                  id="observed-location"
                  value={draftFilters.location}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                />
              </Field>
            </FieldGroup>
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm">
                Apply Filters
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setDraftFilters({
                    q: "",
                    status: "",
                    source_type: "",
                    source_key: "",
                    medium: "",
                    location: "",
                  })
                  router.push(
                    buildObservedHref(
                      {
                        q: "",
                        status: "",
                        source_type: "",
                        source_key: "",
                        medium: "",
                        location: "",
                      },
                      { limit: 25, offset: 0 }
                    )
                  )
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <CardTitle>Observed Clients</CardTitle>
          <CardDescription>
            {items.length === 0
              ? "No observed clients matched the current filters."
              : `Showing ${pageStart}-${pageEnd} of ${pagination.total} observed clients.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <Empty className="min-h-[16rem] border bg-muted/20">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <RadarIcon />
                </EmptyMedia>
                <EmptyTitle>No observed clients</EmptyTitle>
                <EmptyDescription>
                  Wait for new network presence or widen the current filters.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MAC Address</TableHead>
                  <TableHead>Managed Match</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.mac_address}</TableCell>
                    <TableCell>
                      {item.managed_device_name ? (
                        <span className="font-medium">{item.managed_device_name}</span>
                      ) : (
                        <span className="text-muted-foreground">Unmanaged</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === "online" ? "secondary" : "outline"}
                      >
                        {statusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Badge variant="outline">{mediumLabel(item.medium)}</Badge>
                        <div className="text-sm text-muted-foreground">
                          <div>{sourceTypeLabel(item.source_type)}</div>
                          <div className="truncate text-xs">{item.source_key}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-col gap-1">
                        {item.location_label ? (
                          <span className="font-medium">{item.location_label}</span>
                        ) : item.observation_display_name ? (
                          <span>{item.observation_display_name}</span>
                        ) : item.observation_external_id ? (
                          <span className="font-mono text-xs">
                            {item.observation_external_id}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                        {item.ssid ? (
                          <span className="truncate text-xs text-muted-foreground">
                            SSID {item.ssid}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <LocalTimestamp value={item.last_seen_at} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {items.length > 0 ? (
          <CardFooter>
            <TablePagination
              pageSizeId="observed-presence-page-size"
              limit={pagination.limit}
              offset={pagination.offset}
              total={pagination.total}
              pageSizes={allowedPageSizes}
              buildHref={({ limit, offset }) =>
                buildObservedHref(filters, { limit, offset })
              }
            />
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}
