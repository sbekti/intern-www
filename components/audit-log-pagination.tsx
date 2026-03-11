"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { startTransition } from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type AuditLogPaginationProps = {
  action: string
  resourceType: string
  resourceId: string
  actorUsername: string
  limit: number
  offset: number
  total: number
  pageSizes: readonly number[]
}

function buildQuery(values: Record<string, string | number | undefined>) {
  const params = new URLSearchParams()

  for (const [key, rawValue] of Object.entries(values)) {
    if (rawValue === undefined || rawValue === "") {
      continue
    }
    params.set(key, String(rawValue))
  }

  const query = params.toString()
  return query ? `/admin/audit-logs?${query}` : "/admin/audit-logs"
}

export function AuditLogPagination({
  action,
  resourceType,
  resourceId,
  actorUsername,
  limit,
  offset,
  total,
  pageSizes,
}: AuditLogPaginationProps) {
  const router = useRouter()

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const currentPage =
    total === 0 ? 1 : Math.min(totalPages, Math.floor(offset / limit) + 1)
  const previousOffset = Math.max(0, offset - limit)
  const nextOffset = offset + limit
  const lastOffset = total === 0 ? 0 : Math.max(0, (totalPages - 1) * limit)
  const hasPrevious = offset > 0
  const hasNext = nextOffset < total

  const baseQuery = {
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    actor_username: actorUsername,
  }

  function goTo(values: Record<string, string | number | undefined>) {
    startTransition(() => {
      router.push(buildQuery(values))
    })
  }

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
      <Field orientation="horizontal" className="w-fit items-center gap-3">
        <FieldLabel htmlFor="audit-page-size">Rows per page</FieldLabel>
        <Select
          value={String(limit)}
          onValueChange={(value) => {
            if (!value) {
              return
            }
            goTo({
              ...baseQuery,
              limit: value,
              offset: 0,
            })
          }}
        >
          <SelectTrigger id="audit-page-size" size="sm" className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <div className="md:ml-auto flex w-fit items-center justify-center text-sm font-medium">
        Page {currentPage} of {totalPages}
      </div>

      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <Button
          variant="outline"
          className="hidden size-8 lg:flex"
          size="icon"
          disabled={!hasPrevious}
          nativeButton={hasPrevious ? false : true}
          render={
            hasPrevious ? (
              <Link href={buildQuery({ ...baseQuery, limit, offset: 0 })} />
            ) : undefined
          }
          aria-label="Go to first page"
        >
          <ChevronsLeftIcon />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          disabled={!hasPrevious}
          nativeButton={hasPrevious ? false : true}
          render={
            hasPrevious ? (
              <Link
                href={buildQuery({ ...baseQuery, limit, offset: previousOffset })}
              />
            ) : undefined
          }
          aria-label="Go to previous page"
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          disabled={!hasNext}
          nativeButton={hasNext ? false : true}
          render={
            hasNext ? (
              <Link href={buildQuery({ ...baseQuery, limit, offset: nextOffset })} />
            ) : undefined
          }
          aria-label="Go to next page"
        >
          <ChevronRightIcon />
        </Button>
        <Button
          variant="outline"
          className="hidden size-8 lg:flex"
          size="icon"
          disabled={!hasNext}
          nativeButton={hasNext ? false : true}
          render={
            hasNext ? (
              <Link href={buildQuery({ ...baseQuery, limit, offset: lastOffset })} />
            ) : undefined
          }
          aria-label="Go to last page"
        >
          <ChevronsRightIcon />
        </Button>
      </div>
    </div>
  )
}
