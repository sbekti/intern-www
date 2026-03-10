import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-xl min-w-0 flex-col gap-5 rounded-2xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">intern-www</p>
          <h1 className="text-3xl font-semibold tracking-tight">Base UI bootstrap is ready.</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            This app will become the internal dashboard for profile, VLAN, and
            device management. The next task will replace this placeholder with
            the real shared shell and navigation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button>Continue Building</Button>
          <p className="font-mono text-xs text-muted-foreground">
            Press <kbd>d</kbd> to toggle theme
          </p>
        </div>
      </div>
    </div>
  )
}
