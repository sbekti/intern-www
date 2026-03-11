"use client"

import { useState } from "react"
import { CheckCircle2Icon, ShieldBanIcon } from "lucide-react"

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type ApprovalState = "idle" | "approved" | "denied"

type ApiError = {
  code?: string
  message?: string
}

function normalizeUserCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)
}

function formatUserCode(value: string) {
  const normalized = normalizeUserCode(value)

  if (normalized.length <= 4) {
    return normalized
  }

  return `${normalized.slice(0, 4)}-${normalized.slice(4)}`
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
  const [userCode, setUserCode] = useState(normalizeUserCode(initialUserCode))
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [approvalState, setApprovalState] = useState<ApprovalState>("idle")
  const [busyAction, setBusyAction] = useState<"approve" | "deny" | null>(null)

  async function submit(action: "approve" | "deny") {
    const normalizedUserCode = normalizeUserCode(userCode)
    if (normalizedUserCode.length !== 8) {
      setSubmitError("Enter the full 8-character device approval code.")
      return
    }

    const formattedUserCode = formatUserCode(normalizedUserCode)

    setBusyAction(action)
    setSubmitError(null)

    const response = await fetch(
      `/api/v1/auth/device_codes/${encodeURIComponent(formattedUserCode)}/${action}`,
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

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        {approvalState === "idle" ? (
          <>
            <DialogHeader>
              <DialogTitle>Device Approval</DialogTitle>
              <DialogDescription>
                Approve or deny a pending login request from the displayed user
                code.
              </DialogDescription>
            </DialogHeader>
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
                  <InputOTP
                    id="device-user-code"
                    maxLength={8}
                    value={userCode}
                    onChange={(value) => {
                      setUserCode(normalizeUserCode(value))
                      if (submitError) {
                        setSubmitError(null)
                      }
                    }}
                    containerClassName="justify-center"
                    autoFocus
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FieldDescription>
                    Paste the full code into the first box or type it manually.
                  </FieldDescription>
                </Field>
                <FieldError>{submitError}</FieldError>
              </FieldGroup>
              <DialogFooter className="sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={busyAction !== null}
                  onClick={() => void submit("deny")}
                >
                  {busyAction === "deny" ? "Denying..." : "Deny"}
                </Button>
                <Button type="submit" disabled={busyAction !== null}>
                  {busyAction === "approve" ? "Approving..." : "Approve"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {approvalState === "approved"
                  ? "Device code approved"
                  : "Device code denied"}
              </DialogTitle>
              <DialogDescription>
                {approvalState === "approved"
                  ? "The client device can now complete login."
                  : "The client device login request has been denied."}
              </DialogDescription>
            </DialogHeader>
            <Empty className="min-h-[16rem] border bg-card shadow-xs">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  {approvalState === "approved" ? (
                    <CheckCircle2Icon />
                  ) : (
                    <ShieldBanIcon />
                  )}
                </EmptyMedia>
                <EmptyTitle>
                  {approvalState === "approved"
                    ? "Approval recorded"
                    : "Denial recorded"}
                </EmptyTitle>
                <EmptyDescription>
                  {approvalState === "approved"
                    ? `The login request for ${formatUserCode(userCode)} can continue on the client device.`
                    : `The login request for ${formatUserCode(userCode)} has been denied.`}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  variant="outline"
                  onClick={() => {
                    setApprovalState("idle")
                    setSubmitError(null)
                    setBusyAction(null)
                    setUserCode("")
                  }}
                >
                  Review another code
                </Button>
              </EmptyContent>
            </Empty>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
