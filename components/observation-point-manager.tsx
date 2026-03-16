"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPinnedIcon, PencilIcon } from "lucide-react"
import { toast } from "sonner"

import type {
  PresenceObservationPoint,
  PresencePagination,
} from "@/lib/api"
import { buildBffPath } from "@/lib/bff"
import { mediumLabel, sourceTypeLabel } from "@/lib/presence"
import { LocalTimestamp } from "@/components/local-timestamp"
import { NetworkDevicesCard } from "@/components/network-devices-card"
import { TablePagination } from "@/components/table-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
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
import { Textarea } from "@/components/ui/textarea"

const allowedPageSizes = [25, 50, 100, 200] as const

type ObservationPointFilters = {
  q: string
  source_type: string
  source_key: string
  medium: string
}

type EditState = {
  location_label: string
  notes: string
}

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

function buildObservationPointHref(
  filters: ObservationPointFilters,
  pagination: { limit: number; offset: number }
) {
  const params = new URLSearchParams()

  params.set("tab", "locations")
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

async function parseApiError(response: Response) {
  try {
    const body = (await response.json()) as { message?: string }
    return body.message ?? `${response.status} ${response.statusText}`
  } catch {
    return `${response.status} ${response.statusText}`
  }
}

export function ObservationPointManager({
  items,
  pagination,
  filters,
}: {
  items: PresenceObservationPoint[]
  pagination: PresencePagination
  filters: ObservationPointFilters
}) {
  const router = useRouter()
  const [draftFilters, setDraftFilters] = useState(filters)
  const [editing, setEditing] = useState<PresenceObservationPoint | null>(null)
  const [editState, setEditState] = useState<EditState>({
    location_label: "",
    notes: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    setDraftFilters(filters)
  }, [filters])

  function openEdit(item: PresenceObservationPoint) {
    setEditing(item)
    setEditState({
      location_label: item.location_label,
      notes: item.notes,
    })
    setSubmitError(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!editing) {
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    const response = await fetch(
      buildBffPath(`/networks/presence/observation_points/${editing.id}`),
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          location_label: editState.location_label,
          notes: editState.notes,
        }),
      }
    )

    if (!response.ok) {
      setSubmitting(false)
      setSubmitError(await parseApiError(response))
      return
    }

    toast.success("Location mapping updated")
    setSubmitting(false)
    setEditing(null)
    router.refresh()
  }

  return (
    <>
      <NetworkDevicesCard
        tab="locations"
        title="Location Mappings"
        description="Search by source, location label, notes, SSID, or raw observation ID."
        footer={
          items.length > 0 ? (
            <TablePagination
              pageSizeId="observation-point-page-size"
              limit={pagination.limit}
              offset={pagination.offset}
              total={pagination.total}
              pageSizes={allowedPageSizes}
              buildHref={({ limit, offset }) =>
                buildObservationPointHref(filters, { limit, offset })
              }
            />
          ) : null
        }
      >
        <form
          className="flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault()
            router.push(
              buildObservationPointHref(draftFilters, {
                limit: pagination.limit,
                offset: 0,
              })
            )
          }}
        >
          <FieldGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field>
              <FieldLabel htmlFor="observation-point-q">Search</FieldLabel>
              <Input
                id="observation-point-q"
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
              <FieldLabel htmlFor="observation-point-medium">Medium</FieldLabel>
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
                <SelectTrigger id="observation-point-medium" className="w-full">
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
              <FieldLabel htmlFor="observation-point-source-type">
                Source Type
              </FieldLabel>
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
                <SelectTrigger
                  id="observation-point-source-type"
                  className="w-full"
                >
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
              <FieldLabel htmlFor="observation-point-source-key">
                Source Key
              </FieldLabel>
              <Input
                id="observation-point-source-key"
                value={draftFilters.source_key}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    source_key: event.target.value,
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
                const cleared = {
                  q: "",
                  source_type: "",
                  source_key: "",
                  medium: "",
                }
                setDraftFilters(cleared)
                router.push(
                  buildObservationPointHref(cleared, { limit: 25, offset: 0 })
                )
              }}
            >
              Clear
            </Button>
          </div>
        </form>
        {items.length === 0 ? (
          <Empty className="min-h-[16rem] border bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MapPinnedIcon />
              </EmptyMedia>
              <EmptyTitle>No observation points</EmptyTitle>
              <EmptyDescription>
                Observation points appear automatically as UniFi and Juniper pollers
                discover them.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Observation Point</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Location Label</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {item.display_name || item.external_id}
                      </span>
                      {item.display_name && item.display_name !== item.external_id ? (
                        <span className="font-mono text-xs text-muted-foreground">
                          {item.external_id}
                        </span>
                      ) : null}
                      {item.parent_external_id ? (
                        <span className="font-mono text-xs text-muted-foreground">
                          Parent {item.parent_external_id}
                        </span>
                      ) : null}
                      {item.ssid ? (
                        <span className="truncate text-xs text-muted-foreground">
                          SSID {item.ssid}
                        </span>
                      ) : null}
                    </div>
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
                      ) : (
                        <span className="text-muted-foreground">Unlabeled</span>
                      )}
                      {item.notes ? (
                        <span className="text-xs text-muted-foreground">
                          {item.notes}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <LocalTimestamp value={item.last_seen_at} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => openEdit(item)}
                      aria-label="Edit location mapping"
                    >
                      <PencilIcon data-icon="inline-start" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </NetworkDevicesCard>

      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit location mapping</DialogTitle>
            <DialogDescription>
              {editing
                ? `Update the location label and notes for ${editing.display_name || editing.external_id}.`
                : "Update the location label and notes for this observation point."}
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="observation-point-location-label">
                  Location Label
                </FieldLabel>
                <Input
                  id="observation-point-location-label"
                  value={editState.location_label}
                  onChange={(event) =>
                    setEditState((current) => ({
                      ...current,
                      location_label: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="observation-point-notes">Notes</FieldLabel>
                <Textarea
                  id="observation-point-notes"
                  value={editState.notes}
                  onChange={(event) =>
                    setEditState((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                />
              </Field>
              <FieldError>{submitError}</FieldError>
            </FieldGroup>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save mapping"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
