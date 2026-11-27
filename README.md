# Capynite — Joshua Edition

Capynite is Joshua's connected game universe. This repository currently ships two playable worlds:

- **Beast Arena** — monster card battle with decks, collection, progression and multiplayer systems.
- **Capi Wars** — five-stage side-scrolling run-and-gun campaign starring the Capynite squad.

The root route (`/`) is the **Capynite Hub**, the shared entry point and identity layer for every world.

## Local development

```bash
npm ci
npm run dev
```

Open the Vite URL and choose a world from the hub.

## Validation

```bash
npm test
npm run build
npm run lint
```

## Environment

Copy `.env.example` to `.env.local` and provide the public Supabase client variables used by the frontend. Never commit `.env` or secret/service-role credentials.

## Product documentation

- `docs/JOSHUA_UNIVERSE.md` — shared universe, product shell and visual language.
- `docs/capynite/CAPYNITE_CHARACTER_OS.md` — canonical modular character architecture.
- `GAME_DESIGN.md` — Beast Arena gameplay design and roadmap.
- `src/games/capyrocket/SPEC.md` — Capi Wars implementation specification.

## Architecture rule

**Capynite is the universe; each game is a world.** Shared navigation and identity belong to the universe layer, while game-specific mechanics remain isolated inside each game.

## Coordinated engineering — TKFLOW Ω
The BeastGames AAA mission uses a Journal-driven development system across independently scoped agents.

- [Master prompts and short resume command](docs/operations/prompts/README.md)
- [Bootstrap v2.0](docs/operations/prompts/BEASTGAMES_AGENT_BOOTSTRAP_V2.md) for onboarding; [Continuation v1.0](docs/operations/prompts/BEASTGAMES_AGENT_CONTINUATION_V1.md) for subsequent work.
- [Canonical Journal](docs/production/TKFLOW_JOURNAL.md), [Mission Board #32](https://github.com/tk6209/beastGames/issues/32), [operations manual](docs/operations/AGENT_OPERATIONS_HUMAN_GUIDE.md).

Target: 100% evidence-based completion, minimum necessary iterations; exclusive claims, independent review and conditional integration. Runtime activation, agent availability and release are separate evidence-bound states.
