# BEASTGAMES — AUTONOMOUS CONTINUATION PROTOCOL v1.0

```ini
PROJECT=BEASTGAMES
REPOSITORY=tk6209/beastGames
MISSION_ID=BG-AAA-CLOSURE-20261126
MISSION_BOARD=GITHUB_ISSUE_32
AUTHORIZATION=OWNER_GRANTED
MODE=TKFLOW_OMEGA
METHODOLOGY=PDCATDD
MASTER_DIRECTIVE=100_PERCENT_COMPLETION
ITERATION_POLICY=MINIMUM_NECESSARY
EXECUTION=CONTINUOUS_AUTONOMOUS
TASK_DISCOVERY=AUTOMATIC
TASK_ALLOCATION=DYNAMIC
JOURNAL_FIRST=TRUE
JOURNAL_LAST=TRUE
CONTEXT_ISOLATION=STRICT
SECURITY_BYPASS=FALSE
LOVABLE_AGENT_USED=NO
```

## 1. DIRETRIZ MESTRA DO OWNER

Continue imediatamente a missão BeastGames utilizando o contrato UNIVERSAL AUTONOMOUS AGENT BOOTSTRAP v2.0 anteriormente recebido.

Sua missão não termina quando sua tarefa atual termina.

Sua missão termina quando todo o trabalho aplicável do BeastGames estiver concluído, integrado, testado e certificado.

Persiga 100% de conclusão com o mínimo de iterações necessárias.

Não aguarde novos comandos do Owner para descobrir, solicitar e assumir novas tarefas dentro da autorização existente.

Não retorne apenas análises, recomendações ou planos quando houver capacidade de execução.

**Execute, teste, corrija, integre, registre e continue.**

## 2. RECUPERAÇÃO AUTOMÁTICA DE CONTEXTO

Antes de qualquer nova alteração, reconcilie:

- Journal canônico.
- Mission Board #32.
- Journals individuais.
- Claims e grants.
- Leases ativos.
- Branches e commits.
- PRs abertas.
- Issues pendentes.
- CI/CD e evidências.
- Dependências entre tarefas.
- Capacidade real dos agentes disponíveis.

Fontes obrigatórias:

https://github.com/tk6209/beastGames/issues/32

https://github.com/tk6209/beastGames/blob/main/docs/production/TKFLOW_JOURNAL.md

Considere também atualizações ainda não integradas presentes nas branches operacionais.

Não reinicie o projeto, não repita o bootstrap desnecessariamente e não descarte trabalho anteriormente realizado.

Preserve seu AGENT_ID e utilize uma nova SESSION_ID quando iniciar uma nova sessão.

## 3. AUTONOMOUS TASK DISCOVERY

Ao concluir sua tarefa atual:

1. Publique as evidências.
2. Atualize seu journal.
3. Libere seu WRITE_SCOPE.
4. Consulte imediatamente o Mission Board.
5. Identifique as tarefas restantes.
6. Classifique criticidade, dependências e disponibilidade.
7. Selecione o maior lote coerente que possa executar.
8. Solicite CLAIM.
9. Obtenha OWNER_GRANT verificável do coordenador delegado.
10. Execute sem aguardar novas instruções do Owner.

Não escolha apenas tarefas pequenas ou fáceis para aumentar artificialmente o número de entregas.

Priorize tarefas que desbloqueiem outras tarefas, reduzam riscos e aproximem a missão do release definitivo.

## 4. DYNAMIC PRIORITY ENGINE

```text
P0 — Segurança crítica e integridade econômica
P0 — Build, dependências e blockers estruturais
P0 — Autoridade do servidor, JWT e RLS
P0 — Atomicidade, idempotência e concorrência
P1 — Integração de branches e PRs
P1 — Funcionalidades incompletas
P1 — Gameplay e multiplayer
P1 — Qualidade, testes e regressões
P2 — UX, performance e acessibilidade
P2 — Documentação e melhorias operacionais
```

Recalcule as prioridades a cada lote concluído.

Não dependa de uma lista estática de tarefas.

Descubra novas tarefas a partir de falhas reais, critérios de aceitação incompletos e gaps de integração.

## 5. CONTINUOUS EXECUTION LOOP

```text
WHILE MISSION_STATUS != ALL_GREEN:

    RECONCILE_JOURNAL
    RECONCILE_MISSION_BOARD
    VERIFY_REPOSITORY_STATE
    DISCOVER_AVAILABLE_TASKS
    UPDATE_DEPENDENCY_GRAPH

    IF CURRENT_TASK_EXISTS:
        CONTINUE_CURRENT_TASK
    ELSE:
        SELECT_HIGHEST_VALUE_AVAILABLE_BATCH
        REQUEST_EXCLUSIVE_CLAIM
        VERIFY_OWNER_GRANT
        ACKNOWLEDGE_TASK

    PLAN_MINIMUM_NECESSARY_CHANGES
    EXECUTE_PDCATDD

    IMPLEMENT
    TEST
    ANALYZE
    FIX
    RETEST

    IF TESTS_FAIL:
        IDENTIFY_ROOT_CAUSE
        APPLY_AUTHORIZED_FIX
        RETEST
    END_IF

    REQUEST_INDEPENDENT_REVIEW
    RESOLVE_REVIEW_FINDINGS
    VERIFY_ACCEPTANCE_CRITERIA

    COMMIT
    PUSH
    CREATE_OR_UPDATE_PR

    VERIFY_MERGE_GATES

    IF ALL_APPLICABLE_GATES_GREEN:
        EXECUTE_AUTHORIZED_MERGE
        VERIFY_INTEGRATION
    ELSE:
        DOCUMENT_REMAINING_GATES
        PRESERVE_HOLD
    END_IF

    PUBLISH_EVIDENCE
    UPDATE_SESSION_JOURNAL
    UPDATE_MISSION_BOARD
    RELEASE_COMPLETED_CLAIMS

    RECOMPUTE_MISSION_PROGRESS

    IF BLOCKED:
        DISCOVER_AUTHORIZED_ALTERNATIVES
        TRY_RECOVERY
        IF BLOCKER_PERSISTS:
            PUBLISH_BLOCKER
            HANDOVER_TASK
            SELECT_NEXT_AVAILABLE_TASK
        END_IF
    END_IF

END_WHILE
```

Execute este loop efetivamente dentro das capacidades reais do ambiente.

Não apenas descreva o loop.

## 6. MAXIMUM DELIVERY PER ITERATION

Em cada ciclo:

- Agrupe tarefas compatíveis.
- Aproveite testes e builds compartilhados.
- Reutilize PRs existentes quando tecnicamente adequado.
- Resolva múltiplos blockers relacionados em um único lote.
- Evite commits, PRs e ciclos de CI desnecessários.
- Não interrompa após cada alteração.
- Não repita discovery sem necessidade.
- Não gere documentação redundante.
- Não transfira ao Owner trabalho que possa executar autonomamente.

Quando houver suporte real a workers ou subagentes, distribua tarefas disjuntas em paralelo.

Quando não houver, execute sequencialmente com máxima eficiência.

## 7. MULTI-AGENT COLLABORATION

Todos os agentes devem cooperar pelo Mission Board e Journal.

Ao identificar uma tarefa adequada para outro agente, publique:

```ini
TYPE=TASK_AVAILABLE
PROJECT=BEASTGAMES
TASK_ID=<TASK_ID>
PRIORITY=<PRIORITY>
OBJECTIVE=<DELIVERABLE>
DEPENDENCIES=<DEPENDENCIES>
SUGGESTED_WRITE_SCOPE=<PATHS>
EXPECTED_EVIDENCE=<EVIDENCE>
```

Ao precisar de revisão independente:

```ini
TYPE=REVIEW_REQUEST
PROJECT=BEASTGAMES
TASK_ID=<TASK_ID>
IMPLEMENTER=<AGENT_ID>
PR=<URL>
HEAD_SHA=<SHA>
REVIEW_SCOPE=<SCOPE>
TEST_EVIDENCE=<URLS>
REVIEW_STATUS=PENDING
```

Agentes disponíveis devem procurar automaticamente tarefas de implementação ou revisão.

Não certifique seu próprio trabalho como revisão independente.

Não declare agentes ativos, revisões concluídas ou testes executados sem evidência.

## 8. BLOCKER RECOVERY ENGINE

Não encerre a missão por causa de um bloqueio isolado.

```text
DISCOVER_BLOCKER
IDENTIFY_ROOT_CAUSE
SEARCH_ALTERNATIVES
IMPLEMENT_AUTHORIZED_RECOVERY
RETEST
```

Considere alternativas como:

- Execução local.
- GitHub Actions.
- Worktrees independentes.
- Runners isolados.
- Artefatos de CI.
- Testes sintéticos.
- Reorganização de dependências.
- Redistribuição entre agentes.
- Handover especializado.

Não contorne autenticação, autorização, controles de segurança ou gates obrigatórios.

Se o bloqueio realmente persistir, registre-o, preserve as evidências e assuma outra tarefa disponível.

## 9. INTEGRATION AND CLOSURE ENGINE

O objetivo não é acumular PRs abertas.

O objetivo é fechar trabalho.

Sempre que possível:

- Reconcilie branches.
- Resolva conflitos.
- Atualize PRs existentes.
- Execute testes integrados.
- Solicite revisão independente.
- Resolva comentários de revisão.
- Execute merges autorizados quando todos os gates aplicáveis estiverem GREEN.
- Verifique o SHA integrado.
- Feche issues somente após cumprimento do Definition of Done.

Não realize deploy ou ativação de funcionalidades sensíveis sem os respectivos gates e autoridade de release.

## 10. PROTECTION AND GOVERNANCE

Preserve integralmente:

```ini
SERVER_AUTHORITY=REQUIRED
JWT_VALIDATION=REQUIRED
RLS=ENFORCED
ECONOMY_FAIL_CLOSED=TRUE
GUEST_REWARDS=DISABLED
ATOMIC_SETTLEMENT=REQUIRED
IDEMPOTENCY=REQUIRED
INDEPENDENT_REVIEW=REQUIRED
PRODUCTION_PROTECTION=ENFORCED
FALSE_GREEN=FORBIDDEN
LOVABLE_AGENT_USED=NO
```

Não remova testes para obter GREEN.

Não transforme SKIPPED, WAIVED, BLOCKED ou UNVERIFIED em PASS.

Não reduza controles de segurança para acelerar o fechamento.

## 11. CONTINUOUS JOURNAL PROTOCOL

O Journal é a memória operacional permanente da missão.

Ao concluir cada lote relevante, publique:

```ini
TYPE=EXECUTION_BATCH_COMPLETED
PROJECT=BEASTGAMES
MISSION_ID=BG-AAA-CLOSURE-20261126
AGENT_ID=<AGENT_ID>
SESSION_ID=<SESSION_ID>
TASKS_COMPLETED=<TASK_IDS>
TASKS_PARTIAL=<TASK_IDS>
TASKS_BLOCKED=<TASK_IDS>
COMMITS=<SHAS>
PRS_UPDATED=<URLS>
PRS_MERGED=<URLS>
TEST_EVIDENCE=<URLS>
SECURITY_EVIDENCE=<URLS>
REVIEW_EVIDENCE=<URLS>
WRITE_SCOPE_RELEASED=<PATHS>
NEXT_TASKS=<TASK_IDS>
MISSION_STATUS=<STATUS>
```

O registro de conclusão de um lote não constitui ordem de parada.

Após publicar, retorne imediatamente ao AUTONOMOUS TASK DISCOVERY.

## 12. TERMINATION CONDITIONS

A execução somente poderá ser encerrada quando ocorrer uma das condições:

```ini
CONDITION_1=MISSION_ALL_GREEN
CONDITION_2=NO_EXECUTABLE_AUTHORIZED_TASKS_AVAILABLE
CONDITION_3=REAL_ENVIRONMENT_LIMIT_REACHED
CONDITION_4=OWNER_EXPLICIT_STOP
```

Nas condições 2 e 3, publique handover completo, blockers reais, claims liberados e instruções de retomada.

Não declare ALL GREEN nessas condições.

Não prometa continuidade em background sem um executor efetivamente ativo.

## 13. CONSOLIDATED DASHBOARD

Mantenha atualizado:

```ini
MISSION_COMPLETION_PERCENT=<EVIDENCE_BASED>
TASKS_TOTAL=<COUNT>
TASKS_GREEN=<COUNT>
TASKS_PARTIAL=<COUNT>
TASKS_BLOCKED=<COUNT>
PRS_OPEN=<COUNT>
PRS_MERGED=<COUNT>
ISSUES_OPEN=<COUNT>
ISSUES_CLOSED=<COUNT>
CRITICAL_VULNERABILITIES=<COUNT>
HIGH_VULNERABILITIES=<COUNT>
TESTS_PASSED=<COUNT>
TESTS_FAILED=<COUNT>
ACTIVE_AGENTS=<VERIFIED_COUNT>
ACTIVE_CLAIMS=<COUNT>
RELEASE_STATUS=<STATUS>
NEXT_EXECUTION_BATCH=<TASK_IDS>
```

Calcule o percentual utilizando critérios de aceitação efetivamente cumpridos, não quantidade de commits ou PRs.

## 14. IMMEDIATE EXECUTION ORDER

```ini
OWNER_GRANTED=TRUE
BOOTSTRAP_ALREADY_RECEIVED=TRUE
CONTINUE_EXISTING_MISSION=TRUE
AUTONOMOUS_TASK_DISCOVERY=TRUE
AUTONOMOUS_TASK_ROUTING=TRUE
BATCH_EXECUTION=TRUE
MINIMIZE_ITERATIONS=TRUE
MAXIMIZE_VERIFIED_DELIVERY=TRUE
STOP_AFTER_SINGLE_TASK=FALSE
STOP_AFTER_SINGLE_PR=FALSE
STOP_AFTER_REPORT=FALSE
TARGET=100_PERCENT
EXIT_CONDITION=ALL_GREEN
```

Retome imediatamente a execução.

Se sua tarefa anterior terminou, descubra e assuma novas tarefas.

Se uma PR estiver bloqueada, resolva os blockers autorizados ou avance em outra frente.

Se houver trabalho paralelo disponível, distribua-o entre agentes efetivamente disponíveis.

Não aguarde um novo comando de continuidade para cada tarefa.

**CONTINUE TKFLOW Ω NOW.**

**BEASTGAMES AAA — LOOP UNTIL ALL GREEN.**
