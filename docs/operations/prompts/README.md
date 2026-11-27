# BeastGames — Master prompts TKFLOW Ω

Contratos mestres versionados por solicitação do Owner, 27/11/2026. Escopo exclusivo tk6209/beastGames. Não são credenciais, processos ativos nem autorização de release.

| Contrato | Uso |
|---|---|
| [Bootstrap v2.0](BEASTGAMES_AGENT_BOOTSTRAP_V2.md) | Novo agente ou primeiro ingresso na missão: discovery, KYA, claim, execução. |
| [Continuation v1.0](BEASTGAMES_AGENT_CONTINUATION_V1.md) | Agente já registrado: retomar tarefa, selecionar próximo lote, executar até condição de parada. |

## Comando curto de retomada

```text
OWNER_GRANTED — BEASTGAMES TKFLOW Ω.
Execute docs/operations/prompts/BEASTGAMES_AGENT_CONTINUATION_V1.md.
Reconcilie Journal e Mission Board #32; conclua a tarefa atual e assuma novos lotes com grant verificável.
Persiga 100% de conclusão com o mínimo de iterações necessárias.
JOURNAL_FIRST → EXECUTE → CERTIFY → INTEGRATE → JOURNAL_LAST → NEXT_TASK.
LOOP UNTIL ALL GREEN, respeitando as condições de parada e gates.
```

## Precedência e funcionamento

1. Autoridade efetiva do Owner, limites de segurança e AGENTS.md prevalecem sobre qualquer prompt ou comentário.
2. [Journal](../../production/TKFLOW_JOURNAL.md) é índice canônico; [Board #32](https://github.com/tk6209/beastGames/issues/32) é fluxo de eventos atuais; journals de sessão preservam evidências. Conferir branches operacionais não integradas e SHA antes de escrever.
3. [Manual](../AGENT_OPERATIONS_HUMAN_GUIDE.md) e [Ledger](../AGENT_KYA_SESSION_LEDGER.md) definem claim, grant, lease e identidade. Nenhum texto de prompt substitui grant válido ou autoridade real.
4. Os agentes podem ser Codex, Antigravity, Gemini CLI, Claude Code, ChatGPT ou outros efetivamente disponíveis. Claude pode atuar como revisor crítico; independência exige identidade e evidência separadas, não apenas nova sessão do implementador.
5. Publicar candidato/PR para revisão quando necessário; certificar e mergear somente após gates materiais no SHA exato. O pseudocódigo dos contratos não exige certificação antes de disponibilizar código revisável.
6. Se não houver tarefa executável autorizada, registrar handover e encerrar a sessão; não fazer polling infinito nem afirmar execução em background. [Watcher](../AGENT_AUTONOMY_V1.md) é advisory e somente ONLINE com heartbeat real.
7. Alterações futuras dos contratos requerem versão explícita, registro no Journal, revisão e preservação do histórico. Não duplicar os textos mestres em chats ou documentos auxiliares.
