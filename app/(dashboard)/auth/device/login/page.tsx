import { redirect } from "next/navigation"

export default async function DeviceAuthLoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    user_code?: string
  }>
}) {
  const params = await searchParams
  const trimmedUserCode = params.user_code?.trim()

  if (trimmedUserCode) {
    redirect(`/auth/device?user_code=${encodeURIComponent(trimmedUserCode)}`)
  }

  redirect("/auth/device")
}
