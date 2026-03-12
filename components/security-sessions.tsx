"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { LaptopIcon, LoaderCircleIcon, LogOutIcon } from "lucide-react"
import { toast } from "sonner"

import type { AuthSession } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatTimestamp(value?: string) {
  if (!value) {
    return "Never"
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

async function post(path: string) {
  const response = await fetch(path, {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
}

export function SecuritySessions({ sessions }: { sessions: AuthSession[] }) {
  const router = useRouter()
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const bulkPath = "/api/v1/profile/sessions/revoke_others"
  const bulkPending = pendingPath === bulkPath

  function runAction(path: string, successMessage: string) {
    setPendingPath(path)
    startTransition(async () => {
      try {
        await post(path)
        toast.success(successMessage)
        router.refresh()
      } catch {
        toast.error("Session update failed. Try again.")
      } finally {
        if (path === bulkPath) {
          setBulkDialogOpen(false)
        }
        setPendingPath(null)
      }
    })
  }

  if (sessions.length === 0) {
    return (
      <Empty className="min-h-[16rem] border-0 shadow-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LaptopIcon />
          </EmptyMedia>
          <EmptyTitle>No active client sessions</EmptyTitle>
          <EmptyDescription>No client sessions are active right now.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => setBulkDialogOpen(true)}
          >
            <LogOutIcon data-icon="inline-start" />
            Sign out all clients
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead>Idle expiry</TableHead>
              <TableHead>Absolute expiry</TableHead>
              <TableHead className="w-[1%] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => {
              const path = `/api/v1/profile/sessions/${session.id}/revoke`
              const busy = pendingPath === path
              return (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {session.client_name}
                      </span>
                      {session.is_current ? <Badge variant="secondary">Current</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell>{formatTimestamp(session.last_used_at)}</TableCell>
                  <TableCell>{formatTimestamp(session.idle_expires_at)}</TableCell>
                  <TableCell>{formatTimestamp(session.expires_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => runAction(path, "Client session revoked.")}
                    >
                      {busy ? (
                        <LoaderCircleIcon className="animate-spin" data-icon="inline-start" />
                      ) : (
                        <LogOutIcon data-icon="inline-start" />
                      )}
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out all clients?</AlertDialogTitle>
            <AlertDialogDescription>
              This will revoke all active client sessions for your account. Your
              current browser SSO session will stay active.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={bulkPending}
              onClick={() => runAction(bulkPath, "All client sessions signed out.")}
            >
              {bulkPending ? (
                <LoaderCircleIcon className="animate-spin" data-icon="inline-start" />
              ) : null}
              Sign out all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
