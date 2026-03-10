import { UnauthorizedState } from "@/components/api-state"
import { VlanManager } from "@/components/vlan-manager"
import { listVlans } from "@/lib/api"

export default async function VlansPage() {
  const vlans = await listVlans()

  if (!vlans.ok) {
    return <UnauthorizedState title="VLAN list unavailable" />
  }

  return (
    <div className="px-4 lg:px-6">
      <VlanManager initialItems={vlans.data.items} />
    </div>
  )
}
