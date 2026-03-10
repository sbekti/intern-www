import { UnauthorizedState } from "@/components/api-state"
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
import { listVlans } from "@/lib/api"

export default async function VlansPage() {
  const vlans = await listVlans()

  if (!vlans.ok) {
    return <UnauthorizedState title="VLAN list unavailable" />
  }

  return (
    <div className="px-4 lg:px-6">
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <CardTitle>VLANs</CardTitle>
          <CardDescription>
            Read-only list from the network management API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vlans.data.items.length === 0 ? (
            <Empty className="min-h-[16rem] border bg-muted/20">
              <EmptyHeader>
                <EmptyTitle>No VLANs</EmptyTitle>
                <EmptyDescription>
                  The backend returned an empty VLAN list.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>VLAN ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vlans.data.items.map((vlan) => (
                  <TableRow key={vlan.id}>
                    <TableCell>{vlan.name}</TableCell>
                    <TableCell>{vlan.vlan_id}</TableCell>
                    <TableCell>{vlan.description || "-"}</TableCell>
                    <TableCell>{vlan.is_active ? "Active" : "Inactive"}</TableCell>
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
