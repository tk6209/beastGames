
- Beast Arena entry: all login/signup starts from the public landing (TelaHome); protected screens without a session redirect to the landing, and auth events only move to the lobby from entry screens. Why: avoids inline login walls and token-refresh kicking players out of battles.
- Stage unactivated P0 backend artifacts under docs/security/p0-release, never supabase/functions or migration discovery paths while production deployment is forbidden; the connected backend is shared and changes deploy immediately.
- The current client economy boundary fails closed until a verified isolated release; AI demo sessions are memory-only and never persist rewards, preserving play without trusting local outcomes.
- Keep the copied legacy demo rules database-free; authenticated reward eligibility must come from a future server-owned transactional session, not the demo snapshot.

## BeastGames coordinated development — TKFLOW Ω
- Before starting work, read [master prompts](docs/operations/prompts/README.md), [canonical Journal](docs/production/TKFLOW_JOURNAL.md), [Mission Board #32](https://github.com/tk6209/beastGames/issues/32) and [operations guide](docs/operations/AGENT_OPERATIONS_HUMAN_GUIDE.md).
- New agent: [Bootstrap v2.0](docs/operations/prompts/BEASTGAMES_AGENT_BOOTSTRAP_V2.md). Registered agent: [Continuation v1.0](docs/operations/prompts/BEASTGAMES_AGENT_CONTINUATION_V1.md).
- Master directive: 100% verified completion with minimum necessary iterations. Batch disjoint work, reuse PRs, prioritize critical path, continue to the next available task after journal and claim release. Exclusive exact-path WRITE_SCOPE, current SHA, valid lease, delegated grant and ACK precede writes.
- No self-certification of independent review, no false GREEN, no Lovable implementation agent, no cross-project context. Product and production protections above remain binding. A prompt or advisory watcher cannot grant authority or establish an active background runner.
