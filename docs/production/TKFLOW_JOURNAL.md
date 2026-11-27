# BeastGames — TKFLOW Ω Journal e Handover AAA
**Estado: NOT ALL GREEN / RELEASE HOLD.** Snapshot 26/11/2026 BRT. Board canônico [#32](https://github.com/tk6209/beastGames/issues/32). Exclusivamente tk6209/beastGames; nenhum contexto de outro projeto.

## Identidade e autoridade
MISSION_ID=BG-AAA-CLOSURE-20261126; AGENT_ID=BG-CHATGPT-COORDINATOR; SESSION_ID=BG-CHATGPT-COORDINATOR--20261127T020800Z--AAA-HANDOVER; ACTOR_KIND=CHATGPT_CHAT; KYA_ID=urn:beastgames:kya:bg-chatgpt-coordinator; KYA_STATE=SELF_DECLARED; WATCHER=OFFLINE. O KYA_ID é identificador operacional local, não credencial criptográfica ou registro externo. OWNER_GRANTED concedido pelo usuário na conversa para implementação, testes, commits e merge condicionado aos gates. Este bootstrap é documentação; não libera produção. Nenhum outro agente está comprovadamente ativo.

## Snapshot antes do bootstrap
- main: 84f2421fda756a0349bd6c8f4c7da3844f679237.
- PR #29: feat/beast-arena-aaa-rebased-main-20261028; HEAD 01ec99745521b69d5e2827d9e797b444fc4e2c3d; Draft; mergeable=true; não mergeada.
- PR #20: feat/capynite-unity-platform-discovery-20261021; HEAD 26c71d78ddcaad7ac1388c6e5fb79a0ce0bf0553; Draft; mergeable=false; nenhum run PR associado retornado.
- CI [45922784298](https://github.com/tk6209/beastGames/actions/runs/45922784298), job test-build 140257177220: npm ci RED por lockfile inconsistente, dependências esbuild 0.28.2 ausentes. Testes, build e lint SKIPPED. Investigar divergência package.json/bun.lock/package-lock.json; não dispensar gate.
- Histórico anterior: 180 testes locais e SQL sintético descritos no plano original, não reexecutados nesta sessão. 67 sessões/0 game_players é snapshot histórico, não métrica atual.
- Nenhum deploy, alteração DB, saldo ou E2E autenticado realizado por este agente. Não confundir mergeabilidade com aprovação.

## Ações efetivamente realizadas
| Evidência | Entrega | Limite |
|---|---|---|
| [60ce64a](https://github.com/tk6209/beastGames/commit/60ce64a32efb2d805f217cbecff8e1f8b957d472) | impedir promoção de progresso legado de missão não confiável | SQL candidato não aplicado/testado |
| [e816d3a](https://github.com/tk6209/beastGames/commit/e816d3aeae02d1e8b0bd5be84aba57934ba567e8) | preservar init multiplayer sem recompensas | sem E2E |
| [#30](https://github.com/tk6209/beastGames/issues/30), [#31](https://github.com/tk6209/beastGames/issues/31) | analytics e AI Battle Coach | abertas |
| [14395ac](https://github.com/tk6209/beastGames/commit/14395ac4eb6efdbe0c81d3b6cf1529bf16827dfb) | contrato de telemetria | sem sink integrado |
| [cc4af28](https://github.com/tk6209/beastGames/commit/cc4af280655971f140a82c237dd7924b0a1187c9) | quatro testes Vitest de telemetria | escritos, não executados |
| [c11e66e](https://github.com/tk6209/beastGames/commit/c11e66e04aa333378b619425fa7e47da426ea9a0) | contrato do coach em quarentena | sem UI/Gateway/testes |
| [27de0ea](https://github.com/tk6209/beastGames/commit/27de0ea3eed88b00815d39f26cefe0d7df15f0aa) | init waiting-only e guard de status | state/events ainda não atômicos |
| [01ec997](https://github.com/tk6209/beastGames/commit/01ec99745521b69d5e2827d9e797b444fc4e2c3d) | incorporar quatro commits main à branch, reconciliar serverApi/game-engine | mergeable confirmado; CI RED |

## Handover / fila executável
| Task | Proposed role (not claimed) | WRITE_SCOPE candidate / acceptance |
|---|---|---|
| BG-00 | Build engineer | package.json, package-lock.json, bun.lock, CI config only: inspect CI run 45922784298; reproduce npm ci failure; regenerate lock using pinned Node/npm without upgrading unrelated packages; npm ci, npm test, npm run build, scoped lint; attach logs and exact SHA. |
| BG-01 | P0 backend | staged SQL and game-engine: inspect actual schema, ACL/RLS and functions in isolated environment; atomic creation of session+owner slot; validate canonical inventory, active catalog, deck 10/max 2, difficulty and power; reject missing owner, forged slot and client reward payload; no trusted provenance from legacy sessions. |
| BG-02 | P0 backend, after BG-01 | atomic state/event CAS in one transaction; lock/compare expected version, waiting-only init, active-only moves, immutable finished sessions, rollback on event failure; exactly one of concurrent moves succeeds; no direct browser mutations. |
| BG-03 | Economy engineer, after BG-02 | staged economy RPCs/ledger: compute server-side winner, coins/XP/streak/drop, history and progression in one transaction, unique event keys and immutable receipt; mission, daily, shop, packs, boost/evolution/season fulfillment; profile lock and nonnegative balance; no debit without fulfillment; no backfill. Preserve proposed daily values 10/15/20/30/40/50/75 until owner approves alternative; reconcile current candidate 50..200. |
| BG-04 | Security QA, independent/read-only | real JWT A/B, anon denial, cross-slot/tenant/session, forged cards and deck, 2/10 concurrent claim/purchase/settlement, retry/replay, rollback on injected failure, expired invite, real schema grants and RLS; test direct HTTP/DB bypass; check all legacy handlers; quarantine on any failure. |
| BG-05 | UX engineer | Lobby and deck UI only: hero, power/shards, single JOGAR, mode drawer, safe-area, portrait/landscape, keyboard and reduced motion; align 10-card rules and actual inventory; test guest and auth refresh without battle ejection. |
| BG-06 | AI Deck engineer | advisor gateway and deck integration: verify supported model/secret/endpoint, server-owned inventory, strict schema and quantities, timeout/quota, untrusted input, no reward authority; valid and invalid model fixtures + real gateway staging. |
| BG-07 | Analytics engineer #30 | integrate observeMultiplayer into join and init paths after inspecting actual callers; confirm success only after accepted playable state; correlate unique attempt, retries, failure taxonomy, client-observed vs server-confirmed; safe nonblocking sink, retention/ACL, admin aggregate funnel, p50/p95 and denominator; no identifiers/tokens/room codes; tests including outage. |
| BG-08 | Coach engineer #31 | staged battle-coach contract, tests, UI, gateway: completed log import and owned server log; bounded structured data, strip identifiers, no arbitrary prompt instructions, strict model output with real turn references, quotas, timeout, PT-BR result/next steps, no writes to economy. Verified vs unverified source labels, no fabricated events. Test A/B, injection, timeout, malformed and fabricated turn. |
| BG-09 | Gameplay engineer | deterministic engine rules, swarm/evolution parity, energy and telegraph, animation/audio/accessible feedback, seeded balance simulation and telemetry; no changes to authority without BG-02 claim. |
| BG-10 | Multiplayer engineer | authenticated room create/join and invite expiry, atomic owner slots, reconnect and versioned recovery, stale/duplicate packets, QR and friends regression; preserve nonrewarding demo; coordinate backend paths with BG-01/02. |
| BG-11 | LiveOps engineer | waves and admin scheduling, active 15 of 70 catalog monsters (verify current data), authorization, timezone, versioned config, rollback; no unsafe production change. |
| BG-12 | Quality engineer #8/#10 | remediate lint without global suppressions, actual Android/iOS landscape+portrait and real authenticated match on canonical deployed SHA; no closure on emulation alone. |
| BG-13 | Unity engineer PR #20 | reconcile branch without force-push, verify pinned Unity editor/licensing, imported rigs, EditMode/PlayMode/WebGL, browser smoke, bridge validation and cosmetic-only runtime, feature flag off until certified; preserve existing worlds/routes. |
| BG-14 | Release manager + independent QA | reconcile all branches, inspect migration discovery and auto-deploy, staging backup/rollback, run full exact-SHA suite and mobile E2E, review evidence, merge only after applicable gates and explicit production release authority; smoke and record deployed SHA; close issues only on DoD. |

## Dependências e regras
BG-00 começa imediatamente; BG-01→02→03→04 é caminho crítico. BG-05/06/07/08/12/13 podem trabalhar em branches isoladas e paths disjuntos; BG-09/10/11 coordenar com backend; BG-14 somente após evidências. Cada claim enumera paths exatos, não concede todo o diretório se houver sobreposição. Coordenador reconcilia alterações compartilhadas em integração serial. As roles são propostas, não workers iniciados. Nenhum merge de PR #29 com migração/Edge Function não certificada em caminho de deploy automático: mover candidatos para docs/security/p0-release conforme AGENTS.md, ou demonstrar isolamento antes de integração. Preservar landing única, TOKEN_REFRESHED sem ejetar, guest demo em memória, economia fail-closed, PT-BR, sem resets de saldo. Usar AI Gateway de runtime quando validado; não confundir com agente de implementação.

## Gates e DoD
Baseline SHA, RED reproduzido, patch mínimo, testes unitários/integrados/concorrência, revisão independente, logs/artefatos por SHA, rollback, release condicionado. Status GREEN apenas para gate material realmente executado; SKIPPED/WAIVED/UNVERIFIED não são PASS. Não remover testes para obter verde. Reabrir ciclo se regressão. ALL GREEN exige fechamento ou classificação explicitamente aprovada de todas as tarefas; não inventar percentuais. NEXT_ATOMIC_TASK=BG-00. UNCOMMITTED_WORK=NONE conhecido no conector; estado de worktrees externas desconhecido. WRITE_SCOPE_RELEASED=documentação após bootstrap. WATCHER=OFFLINE.

## Referências locais
[Ledger](../operations/AGENT_KYA_SESSION_LEDGER.md) · [Manual](../operations/AGENT_OPERATIONS_HUMAN_GUIDE.md) · [Índice](../operations/agent-sessions/README.md) · [Plano original](../AAA_GAME_REBUILD_TKDECOMPOSE.md) · [98 passos PR #29](https://github.com/tk6209/beastGames/blob/01ec99745521b69d5e2827d9e797b444fc4e2c3d/docs/AAA_GITHUB_TKDECOMPOSE_98.md).

## Diretiva permanente do Owner — continuidade canônica (26/11/2026 BRT)
- **Journal-first / Journal-last:** este arquivo é o índice canônico de continuidade do BeastGames; o [Mission Board #32](https://github.com/tk6209/beastGames/issues/32) é o log operacional de eventos/claims em tempo real, e os journals individuais são as evidências append-only. Juntos formam o Journal; chats, automações, Slack e agentes são executores ou interfaces, jamais substitutos.
- Toda sessão humana, LLM, CI ou automação deve iniciar reconciliando Journal, Board, ledger, HEAD, leases e evidências; executar somente dentro de escopo/grant; ao encerrar, registrar SHA, testes, decisões, blockers, próximo trabalho atômico e liberar o claim. Nunca reiniciar a missão por falta de contexto de chat.
- Atualizações futuras devem preservar histórico, escopo exclusivo de BeastGames e links por SHA. Eventos do Board prevalecem para estado operacional mais recente; divergências devem ser explicitadas e reconciliadas antes de escrever. O watcher é advisory, não autoridade para grants, merges, deploy ou revisão independente.
- Política permanente: sem falso GREEN, sem autoaprovação, sem ativação de P0 ou alterações de produção sem gates e autoridade. Nenhum watcher é ONLINE antes de heartbeat real. Autonomia significa execução comprovada, não apenas cron configurado.

### Snapshot reconciliado nesta sessão
- PR #34: lockfile corrigido, CI 45927543849 PASS, integração e revisão independente pendentes; main permanece RED.
- PR #35: telemetria, 196 testes PASS, integração real de join/init e funnel pendentes.
- PR #36: lint parcial, 283 erros / 24 avisos ainda presentes; PR #37 audit RED, 14 findings runtime (12 high, 2 moderate) e 2 critical dev-inclusive; remediação necessária.
- PRs #38/#39: criação atômica não recompensável e PostgreSQL sintético PASS, run 45928059051; JWT/RLS real e init canônico pendentes.
- PR #40: contrato coach candidato, CI a reconciliar; sem ativação.
- PR #41: watcher CI 45928695198 PASS, validate 45928695187 RED; cron não ativado no default branch, revisão independente e merge pendentes. Executor recorrente bloqueado pelo limite de automações; nenhuma rotina existente alterada.
- NEXT_ATOMIC_TASK=BG-00 dependency remediation / BG-01 canonical init in disjoint claims; reconcile watcher validate failure separately. RELEASE=HOLD.
- Owner directive recorded via Board claim 7208213929; grant 7208218233; ACK 7208218771. This is an append-only documentation update in PR #41, not a merge to main.
