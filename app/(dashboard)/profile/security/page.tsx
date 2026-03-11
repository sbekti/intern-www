import { ArrowUpRightIcon, KeyRoundIcon, ShieldIcon } from "lucide-react"

import { UnauthorizedState } from "@/components/api-state"
import { SecuritySessions } from "@/components/security-sessions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { listProfileSessions } from "@/lib/api"

const passwordSettingsUrl = "https://sso.corp.bekti.com/if/user/#/settings"

export default async function ProfileSecurityPage() {
  const sessions = await listProfileSessions()

  if (!sessions.ok) {
    return <UnauthorizedState title="Security unavailable" />
  }

  return (
    <div className="grid gap-4 px-4 lg:px-6">
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRoundIcon />
            <CardTitle>Password</CardTitle>
          </div>
          <CardDescription>
            Password changes are handled by the central SSO settings page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            nativeButton={false}
            render={
              <a
                href={passwordSettingsUrl}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <ArrowUpRightIcon data-icon="inline-end" />
            Open Password Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldIcon />
            <CardTitle>Client Sessions</CardTitle>
          </div>
          <CardDescription>
            Active public-client sessions such as `internctl`. Your browser SSO
            session is not listed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SecuritySessions sessions={sessions.data.items} />
        </CardContent>
      </Card>
    </div>
  )
}
