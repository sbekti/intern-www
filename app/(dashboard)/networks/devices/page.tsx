import { ForbiddenState, UnauthorizedState } from "@/components/api-state"
import { DeviceManager } from "@/components/device-manager"
import { listDevices, listVlans } from "@/lib/api"

export default async function DevicesPage() {
  const [devices, vlans] = await Promise.all([listDevices(), listVlans()])

  if (!devices.ok) {
    if (devices.status === 403) {
      return <ForbiddenState title="Device management unavailable" />
    }

    return <UnauthorizedState title="Device management unavailable" />
  }

  if (!vlans.ok) {
    return <UnauthorizedState title="Device management unavailable" />
  }

  return (
    <div className="px-4 lg:px-6">
      <DeviceManager initialItems={devices.data.items} vlans={vlans.data.items} />
    </div>
  )
}
