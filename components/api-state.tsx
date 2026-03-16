import { LockIcon, ServerOffIcon, ShieldAlertIcon } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function UnauthorizedState({
}: Record<string, never>) {
  return (
    <div className="px-4 lg:px-6">
      <Empty className="min-h-[20rem] border bg-card shadow-xs">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LockIcon />
          </EmptyMedia>
          <EmptyTitle>Sign-in required</EmptyTitle>
          <EmptyDescription>
            Authentication is required before this view can load data from the
            backend.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

export function ForbiddenState({
}: Record<string, never>) {
  return (
    <div className="px-4 lg:px-6">
      <Empty className="min-h-[20rem] border bg-card shadow-xs">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShieldAlertIcon />
          </EmptyMedia>
          <EmptyTitle>Access denied</EmptyTitle>
          <EmptyDescription>
            Your account is authenticated, but this screen requires
            administrative access.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

export function BackendUnavailableState({
}: Record<string, never>) {
  return (
    <div className="px-4 lg:px-6">
      <Empty className="min-h-[20rem] border bg-card shadow-xs">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ServerOffIcon />
          </EmptyMedia>
          <EmptyTitle>Backend unavailable</EmptyTitle>
          <EmptyDescription>
            This view is not supported by the current backend yet. Update the
            backend deployment and try again.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

type RequiredBackendStateProps = {
  status: number
  fallback?: "unauthorized" | "forbidden"
}

export function RequiredBackendState({
  status,
  fallback = "unauthorized",
}: RequiredBackendStateProps) {
  if (status === 401) {
    return <UnauthorizedState />
  }

  if (status === 403) {
    return <ForbiddenState />
  }

  if (status === 404) {
    return <BackendUnavailableState />
  }

  return fallback === "forbidden" ? <ForbiddenState /> : <UnauthorizedState />
}
