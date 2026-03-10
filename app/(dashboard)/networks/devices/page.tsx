import { ForbiddenState, UnauthorizedState } from "@/components/api-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { listDevices } from "@/lib/api"

export default async function DevicesPage() {
  const devices = await listDevices()

  if (!devices.ok) {
    if (devices.status === 403) {
      return <ForbiddenState title="Device management unavailable" />
    }

    return <UnauthorizedState title="Device management unavailable" />
  }

  return (
    <div className="px-4 lg:px-6">
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <CardTitle>Devices</CardTitle>
          <CardDescription>
            Read-only device registrations from the network management API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {devices.data.items.length === 0 ? (
            <Empty className="min-h-[16rem] border bg-muted/20">
              <EmptyHeader>
                <EmptyTitle>No devices</EmptyTitle>
                <EmptyDescription>
                  The backend returned an empty device list.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>MAC Address</TableHead>
                  <TableHead>VLAN</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.data.items.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.display_name}</TableCell>
                    <TableCell>{device.mac_address}</TableCell>
                    <TableCell>
                      {device.vlan.name} ({device.vlan.vlan_id})
                    </TableCell>
                    <TableCell>
                      {new Date(device.updated_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
