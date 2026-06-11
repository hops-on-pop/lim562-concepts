# LIM 562 Concept Explorer

Interactive study site for **LIM 562: Transformative Technologies in LIS**. Each topic pairs a short concept recap with a clickable diagram or exploration activity.

No login, grading, or saved progress — refresh starts a new session.

## Topics

| Route | Topic |
| --- | --- |
| `/concepts/dev-lifecycle` | The development lifecycle (SDLC) |
| `/concepts/web-app-architecture` | How a web application works |
| `/concepts/platform-tradeoffs` | Software and hosting tradeoffs |
| `/concepts/ai-ml-lifecycle` | The AI/ML lifecycle |
| `/concepts/ai-ml-libraries` | AI & machine learning in libraries |

Concept copy lives in `src/lib/concepts.ts`. Interactive modules are in `src/components/concepts/`.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- React 19, TypeScript
- Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com)
- [Motion](https://motion.dev) for animations
- [Biome](https://biomejs.dev) for lint and format

## Getting started

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the dev server |
| `bun run build` | Production build |
| `bun run start` | Serve the production build |
| `bun run lint` | Run Biome checks |
| `bun run format` | Format with Biome |
