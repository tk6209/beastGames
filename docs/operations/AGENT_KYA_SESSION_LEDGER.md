# BeastGames — Registro KYA operacional
[Board #32](https://github.com/tk6209/beastGames/issues/32) · [Manual](AGENT_OPERATIONS_HUMAN_GUIDE.md) · [Journal](../production/TKFLOW_JOURNAL.md) · [Sessões](agent-sessions/README.md)
KYA é proveniência operacional, não autenticação criptográfica. AGENT_ID persistente, SESSION_ID único por execução; KYA_ID local não transfere autorização. Estados SELF_DECLARED, CLAIM_CORROBORATED (evidência de trabalho conferida, não identidade criptográfica), REVOKED. JOIN não concede claim. Sem heartbeat verificado, WATCHER=OFFLINE.
| AGENT_ID | KYA_ID | SESSION_ID | Estado / role | Claim |
|---|---|---|---|---|
| BG-CHATGPT-COORDINATOR | urn:beastgames:kya:bg-chatgpt-coordinator | [BG-CHATGPT-COORDINATOR--20261127T020800Z--AAA-HANDOVER](agent-sessions/BG-CHATGPT-COORDINATOR/BG-CHATGPT-COORDINATOR--20261127T020800Z--AAA-HANDOVER.md) | SELF_DECLARED / coordinator / OFFLINE | documentação bootstrap; liberar ao concluir |
Nenhum outro agente registrado nesta entrada. Novos agentes emitem JOIN-KYA no board e recebem grants exclusivos. Não registrar nomes como agentes ativos sem ACK e evidência. Não incluir segredos.

## Referência aos contratos mestres
[Bootstrap v2.0](prompts/BEASTGAMES_AGENT_BOOTSTRAP_V2.md) · [Continuation v1.0](prompts/BEASTGAMES_AGENT_CONTINUATION_V1.md). AGENT_ID permanece estável; cada retomada em nova execução gera SESSION_ID e PARENT_SESSION_ID quando aplicável. Claims expiram e não são herdados automaticamente. Identidade autodeclarada não equivale a autorização ou identidade criptográfica; revisão independente não pode ser certificada pelo mesmo implementador. Board #32 é registro corrente, não este snapshot estático.
