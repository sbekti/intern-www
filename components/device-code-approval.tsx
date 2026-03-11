"use client"

import { useState } from "react"
import { CheckCircle2Icon, ShieldBanIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type ApprovalState = "idle" | "approved" | "denied"

type ApiError = {
  code?: string
  message?: string
}

function normalizeUserCode(value: string) {
  return value.trim().toUpperCase()
}

async function parseApiError(response: Response) {
  try {
    const body = (await response.json()) as ApiError
    return body.message ?? `${response.status} ${response.statusText}`
  } catch {
    return `${response.status} ${response.statusText}`
  }
}

export function DeviceCodeApproval({
  initialUserCode,
}: {
  initialUserCode: string
}) {
  const [userCode, setUserCode] = useState(initialUserCode)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [approvalState, setApprovalState] = useState<ApprovalState>("idle")
  const [busyAction, setBusyAction] = useState<"approve" | "deny" | null>(null)

  async function submit(action: "approve" | "deny") {
    const normalizedUserCode = normalizeUserCode(userCode)
    if (!normalizedUserCode) {
      setSubmitError("Enter the device approval code.")
      return
    }

    setBusyAction(action)
    setSubmitError(null)

    const response = await fetch(
      `/api/v1/auth/device_codes/${encodeURIComponent(normalizedUserCode)}/${action}`,
      {
        method: "POST",
      }
    )

    if (!response.ok) {
      setBusyAction(null)
      setSubmitError(await parseApiError(response))
      return
    }

    setUserCode(normalizedUserCode)
    setApprovalState(action === "approve" ? "approved" : "denied")
    setBusyAction(null)
  }

  if (approvalState !== "idle") {
    const approved = approvalState === "approved"

    return (
      <div className="px-4 lg:px-6">
        <Empty className="min-h-[24rem] border bg-card shadow-xs">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              {approved ? <CheckCircle2Icon /> : <ShieldBanIcon />}
            </EmptyMedia>
            <EmptyTitle>
              {approved ? "Device code approved" : "Device code denied"}
            </EmptyTitle>
            <EmptyDescription>
              {approved
                ? `The login request for ${userCode} can now complete on the client device.`
                : `The login request for ${userCode} has been denied.`}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              onClick={() => {
                setApprovalState("idle")
                setSubmitError(null)
              }}
            >
              Review another code
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="grid gap-4 px-4 lg:px-6">
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <CardTitle>Device Approval</CardTitle>
          <CardDescription>
            Approve or deny a pending login request from the displayed user
            code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-6"
            onSubmit={(event) => {
              event.preventDefault()
              void submit("approve")
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="device-user-code">User code</FieldLabel>
                <Input
                  id="device-user-code"
                  value={userCode}
                  onChange={(event) => setUserCode(event.target.value)}
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="ABCD-EFGH"
                  required
                />
                <FieldDescription>
                  Paste the code shown by the client login flow.
                </FieldDescription>
              </Field>
              <FieldError>{submitError}</FieldError>
            </FieldGroup>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busyAction !== null}>
                {busyAction === "approve" ? "Approving..." : "Approve"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busyAction !== null}
                onClick={() => void submit("deny")}
              >
                {busyAction === "deny" ? "Denying..." : "Deny"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
