# intern-www

Next.js frontend for the internal network and homelab dashboard.

Current bootstrap:
- Next.js 16 App Router
- `shadcn/ui` v4 with `base-nova`
- Base UI primitives

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Adding components

Use the shadcn CLI with the project-local package manager:

```bash
npx shadcn@latest add button
```

Components are written into [`components/ui`](./components/ui).

```tsx
import { Button } from "@/components/ui/button";
```
