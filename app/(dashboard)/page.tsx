import { CloudSunIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="grid gap-4 px-4 lg:px-6">
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <CardTitle>Welcome to Intern</CardTitle>
          <CardDescription>
            This dashboard will manage your homelab network, registered devices,
            and appliance control surfaces from one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          The current shell is intentionally simple while the live API wiring is
          added. Next, this card can show profile-aware welcome text, status
          summaries, or quick links if you want them.
        </CardContent>
      </Card>
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CloudSunIcon />
            <CardTitle>Weather</CardTitle>
          </div>
          <CardDescription>
            This section will render the cached local forecast from the API.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          For now this stays as a placeholder until the dashboard endpoint is
          wired into the frontend.
        </CardContent>
      </Card>
    </div>
  )
}
