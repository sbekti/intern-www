import Link from "next/link"

import { AuditLogPagination } from "@/components/audit-log-pagination"
import { ForbiddenState, UnauthorizedState } from "@/components/api-state"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { listAdminAuditLogs, type AuditLogEntry } from "@/lib/api"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const defaultPageSize = 25
const allowedPageSizes = [25, 50, 100, 200] as const

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

function parseOffset(value: string) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }
  return parsed
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

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
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

function renderMetadata(entry: AuditLogEntry) {
  return JSON.stringify(entry.metadata)
}

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const action = readParam(params, "action")
  const resourceType = readParam(params, "resource_type")
  const resourceId = readParam(params, "resource_id")
  const actorUsername = readParam(params, "actor_username")
  const limit = parsePageSize(readParam(params, "limit"))
  const offset = parseOffset(readParam(params, "offset"))

  const auditLogs = await listAdminAuditLogs({
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    actor_username: actorUsername,
    limit,
    offset,
  })

  if (!auditLogs.ok) {
    if (auditLogs.status === 401) {
      return <UnauthorizedState title="Audit logs unavailable" />
    }

    return <ForbiddenState title="Audit logs require admin access" />
  }

  const page = auditLogs.data
  const pageStart = page.pagination.total === 0 ? 0 : offset + 1
  const pageEnd = Math.min(offset + page.items.length, page.pagination.total)

  return (
    <div className="grid gap-4 px-4 lg:px-6">
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Narrow the audit stream by exact action, resource, or actor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/admin/audit-logs" className="flex flex-col gap-6">
            <FieldGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Field>
                <FieldLabel htmlFor="action">Action</FieldLabel>
                <Input id="action" name="action" defaultValue={action} />
              </Field>
              <Field>
                <FieldLabel htmlFor="resource_type">Resource Type</FieldLabel>
                <Input
                  id="resource_type"
                  name="resource_type"
                  defaultValue={resourceType}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="resource_id">Resource ID</FieldLabel>
                <Input
                  id="resource_id"
                  name="resource_id"
                  defaultValue={resourceId}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="actor_username">Actor Username</FieldLabel>
                <Input
                  id="actor_username"
                  name="actor_username"
                  defaultValue={actorUsername}
                />
              </Field>
            </FieldGroup>
            <input type="hidden" name="limit" value={String(limit)} />
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm">
                Apply Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={buildQuery({ limit: defaultPageSize })} />}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <CardTitle>Audit Stream</CardTitle>
          <CardDescription>
            Showing {pageStart}-{pageEnd} of {page.pagination.total} entries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Metadata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {page.items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No audit logs matched the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                page.items.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatTimestamp(entry.created_at)}</TableCell>
                    <TableCell>{entry.actor_username}</TableCell>
                    <TableCell>{entry.action}</TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-col">
                        <span>{entry.resource_type}</span>
                        <span className="max-w-[22rem] truncate text-xs text-muted-foreground">
                          {entry.resource_id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[28rem] whitespace-normal">
                      <code className="line-clamp-2 break-all text-xs text-muted-foreground">
                        {renderMetadata(entry)}
                      </code>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <AuditLogPagination
            action={action}
            resourceType={resourceType}
            resourceId={resourceId}
            actorUsername={actorUsername}
            limit={page.pagination.limit}
            offset={page.pagination.offset}
            total={page.pagination.total}
            pageSizes={allowedPageSizes}
          />
        </CardFooter>
      </Card>
    </div>
  )
}
