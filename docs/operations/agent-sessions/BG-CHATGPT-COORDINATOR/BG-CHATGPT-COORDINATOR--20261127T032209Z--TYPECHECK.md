# BG-00 Typecheck recovery

Base `268c8d65`; PR #37. Major candidate 191/191 tests and build pass, full/runtime high/critical zero; typecheck failed (job 140291738049). Fix explicit Node and Vitest jest-dom types, Vitest setup import, stale purchase request field, ES2020-compatible final event indexing. No production behavior changed, no check disabled. New CI and independent review required. Previous guest regression commit and board handoff preserved. Watcher offline; release HOLD.
