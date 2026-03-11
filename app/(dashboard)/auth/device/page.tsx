import { DeviceCodeApproval } from "@/components/device-code-approval"

export default async function DeviceAuthPage({
  searchParams,
}: {
  searchParams: Promise<{
    user_code?: string
  }>
}) {
  const params = await searchParams

  return (
    <DeviceCodeApproval initialUserCode={params.user_code?.trim() ?? ""} />
  )
}
