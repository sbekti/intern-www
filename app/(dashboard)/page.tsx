import { CloudSunIcon, NetworkIcon } from "lucide-react"

import { UnauthorizedState } from "@/components/api-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboard } from "@/lib/api"

function weatherCodeLabel(code: number) {
  switch (code) {
    case 0:
      return "Clear"
    case 1:
    case 2:
    case 3:
      return "Partly cloudy"
    case 45:
    case 48:
      return "Fog"
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
      return "Rain"
    case 71:
    case 73:
    case 75:
      return "Snow"
    case 95:
    case 96:
    case 99:
      return "Thunderstorm"
    default:
      return `Code ${code}`
  }
}

export default async function HomePage() {
  const dashboard = await getDashboard()

  if (!dashboard.ok) {
    return <UnauthorizedState title="Dashboard unavailable" />
  }

  return (
    <div className="grid gap-4 px-4 lg:px-6">
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <CardTitle>Welcome to Intern</CardTitle>
          <CardDescription>
            {dashboard.data.welcome_message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-sm font-medium text-foreground">
                Signed in as {dashboard.data.profile.name}
              </p>
              <p className="mt-1 text-sm">{dashboard.data.profile.email}</p>
              <p className="mt-3 text-sm">
                Username: {dashboard.data.profile.username}
              </p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <NetworkIcon />
                Network summary
              </div>
              <p className="mt-2 text-sm">
                {dashboard.data.network_summary.device_count} devices across{" "}
                {dashboard.data.network_summary.vlan_count} VLANs
              </p>
              <p className="mt-3 text-sm">
                Admin access: {dashboard.data.profile.is_admin ? "yes" : "no"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CloudSunIcon />
            <CardTitle>Weather</CardTitle>
          </div>
          <CardDescription>
            {dashboard.data.weather
              ? `${dashboard.data.weather.location_name} · ${dashboard.data.weather.timezone}`
              : "No weather data returned by the dashboard endpoint."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          {dashboard.data.weather ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-sm font-medium text-foreground">Condition</p>
                <p className="mt-2 text-sm">
                  {weatherCodeLabel(dashboard.data.weather.current.weather_code)}
                </p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-sm font-medium text-foreground">
                  Temperature
                </p>
                <p className="mt-2 text-sm">
                  {dashboard.data.weather.current.temperature_c.toFixed(1)} C
                </p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-sm font-medium text-foreground">Wind</p>
                <p className="mt-2 text-sm">
                  {dashboard.data.weather.current.wind_speed_kph.toFixed(1)} kph
                </p>
              </div>
            </div>
          ) : (
            "The backend is reachable, but no weather payload is currently available."
          )}
        </CardContent>
      </Card>
    </div>
  )
}
