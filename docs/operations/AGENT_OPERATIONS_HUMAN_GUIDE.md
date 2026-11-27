# BeastGames — Manual operacional TKFLOW Ω
Board único [#32](https://github.com/tk6209/beastGames/issues/32). Repositório exclusivo tk6209/beastGames. [Journal e backlog](../production/TKFLOW_JOURNAL.md). [Ledger](AGENT_KYA_SESSION_LEDGER.md). Não reutilizar permissões, IDs, sessões, boards ou canais de outro projeto.

## Protocolo de coordenação
Owner define missão e limites; coordenador delegado distribui claims e reconcilia; implementadores executam em branches separadas; revisor independente não certifica o próprio patch; release manager verifica evidências. Um agente pode assumir vários papéis em momentos distintos, mas não autoaprovar gate independente.
1. Ler AGENTS.md, journal, últimos comentários do board, HEAD/main e claims ativos. Emitir JOIN-KYA com PROJECT, AGENT_ID persistente, SESSION_ID único, ACTOR_KIND, DISPLAY_NAME, KYA_ID local e WATCHER. JOIN não autoriza escrita.
2. CLAIM_REQUEST para tarefa livre, branch, HEAD_SHA, paths exatos, lease UTC, dependências, testes. Um writer por path/branch; se houver conflito, SUGGESTION_ONLY. Claims são política auditável, não lock transacional; coordenador deve serializar grants e conferir SHA.
3. OWNER_GRANT registrado pelo owner/coordenador delegado com identidade, escopo, branch, SHA, validade e link. Sem grant válido, READ_ONLY. TASK_ACK com link. Não assumir tarefa porque está aberta; sem atividade comprovada, watcher OFFLINE.
4. TKFLOW/PDCATDD: PLAN (DoD, dependências), RED (reprodução), CHANGE (patch), TEST (GREEN real), REVIEW independente, DECISION, PROGRESS, NEXT. Persistir evidência no journal append-only da própria sessão e links no board. Trabalhar em lotes coerentes; não parar a cada microtarefa para pedir nova autorização dentro do grant.
5. Se bloqueado, tentar alternativas legítimas (runner local/CI, staging isolado, outro agente); nunca desativar auth/RLS ou falsificar testes. Registrar BLOCKED com causa, comandos, alternativas tentadas, responsável e próximo passo. Continuar tarefas independentes.
6. DONE/HANDOFF: SHA, status, testes, PR, pendências, estado de worktree, NEXT_ATOMIC_TASK e WRITE_SCOPE_RELEASED. Solicitar próxima tarefa livre. RESUME em nova sessão com PARENT_SESSION_ID e novo grant. Não fingir processo ativo entre chats.
7. Merge serial somente com gates materiais verdes e autoridade; deploy separado, sem ativação automática de candidatos P0. Fechar issue apenas com evidências de DoD. Atualizar cabeçalho humano do board, mantendo comentários históricos.

## Envelope obrigatório de evento
```text
PROJECT=BEASTGAMES
MISSION_ID=BG-AAA-CLOSURE-20261126
TYPE=JOIN-KYA|CLAIM_REQUEST|OWNER_GRANT|TASK_ACK|PLAN|RED|CHANGE|TEST|REVIEW|PROGRESS|BLOCKED|DECISION|HANDOFF|RELEASE|DONE
UTC=<actual timestamp>
AGENT_ID=<persistent local persona>
SESSION_ID=<unique execution>
PARENT_SESSION_ID=<or NONE>
KYA_STATE=SELF_DECLARED|CLAIM_CORROBORATED|REVOKED
WATCHER=OFFLINE|<verified runner evidence>
TASK=<BG-ID>
BRANCH=<ref>
HEAD_SHA=<sha>
WRITE_SCOPE=<exact paths or NONE>
LEASE_UNTIL=<UTC or NONE>
GRANT_LINK=<permalink or NONE>
EVIDENCE=<commit/test run/PR links>
STATE=OPEN|RED|PASS|UNVERIFIED|BLOCKED|HOLD|DONE
NEXT_ATOMIC_TASK=<task>
```
## Cadência
Agentes efetivamente em execução consultam board ao iniciar e antes de escrever; reavaliam lease a cada ciclo. Se houver runner agendado comprovado, registrar frequência real e heartbeat; nenhuma instrução cria daemon automaticamente. Não publicar spam de status. Coordenador mantém painel por gates, responsáveis e evidências, não percentuais arbitrários.

## Contratos mestres e ciclo de trabalho contínuo
Use [Bootstrap v2.0](prompts/BEASTGAMES_AGENT_BOOTSTRAP_V2.md) para iniciar agentes e [Continuation v1.0](prompts/BEASTGAMES_AGENT_CONTINUATION_V1.md) para retomar agentes existentes. [Índice/comando curto](prompts/README.md). Os contratos são fonte única; não duplicar em outros manuais.

Owner → coordenador (grants/leases e dependências) → implementadores (paths exclusivos) → revisor independente (SHA/evidência) → integração serial → journal/board → próximo lote. A revisão pode ocorrer sobre PR draft; merge somente após gates. Nenhuma espera por novo comando humano para tarefas dentro de autorização e grant; sem grant, trabalhar read-only ou solicitar outro escopo. Ao concluir ou bloquear, publicar handover, liberar claim e buscar próxima tarefa. Parar apenas ALL_GREEN, ausência de tarefa executável autorizada, limite real de ambiente ou ordem do Owner. Sem daemon implícito.

Eventos complementares: TASK_AVAILABLE, REVIEW_REQUEST, EXECUTION_BATCH_COMPLETED. Incluir o envelope de identidade/tempo/escopo existente quando aplicável. Claims de comentários não são locks transacionais; verificar conflitos e SHA antes de escrever. O painel usa DoD verificável, nunca número de commits como progresso global.
