import { UnauthorizedState } from "@/components/api-state"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProfile } from "@/lib/api"

export default async function ProfilePage() {
  const profile = await getProfile()

  if (!profile.ok) {
    return <UnauthorizedState title="Profile unavailable" />
  }

  return (
    <div className="grid gap-4 px-4 lg:px-6">
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <CardTitle>{profile.data.name}</CardTitle>
          <CardDescription>{profile.data.email}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-sm font-medium text-foreground">Username</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {profile.data.username}
            </p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-sm font-medium text-foreground">Access</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {profile.data.is_admin ? "Administrator" : "Authenticated user"}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <CardTitle>Groups</CardTitle>
          <CardDescription>
            Current group membership from the authenticated backend profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {profile.data.groups.map((group) => (
            <Badge key={group} variant="outline">
              {group}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
