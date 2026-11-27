# BeastGames — Registro KYA operacional
[Board #32](https://github.com/tk6209/beastGames/issues/32) · [Manual](AGENT_OPERATIONS_HUMAN_GUIDE.md) · [Journal](../production/TKFLOW_JOURNAL.md) · [Sessões](agent-sessions/README.md)
KYA é proveniência operacional, não autenticação criptográfica. AGENT_ID persistente, SESSION_ID único por execução; KYA_ID local não transfere autorização. Estados SELF_DECLARED, CLAIM_CORROBORATED (evidência de trabalho conferida, não identidade criptográfica), REVOKED. JOIN não concede claim. Sem heartbeat verificado, WATCHER=OFFLINE.
| AGENT_ID | KYA_ID | SESSION_ID | Estado / role | Claim |
|---|---|---|---|---|
| BG-CHATGPT-COORDINATOR | urn:beastgames:kya:bg-chatgpt-coordinator | [BG-CHATGPT-COORDINATOR--20261127T020800Z--AAA-HANDOVER](agent-sessions/BG-CHATGPT-COORDINATOR/BG-CHATGPT-COORDINATOR--20261127T020800Z--AAA-HANDOVER.md) | SELF_DECLARED / coordinator / OFFLINE | documentação bootstrap; liberar ao concluir |
Nenhum outro agente registrado nesta entrada. Novos agentes emitem JOIN-KYA no board e recebem grants exclusivos. Não registrar nomes como agentes ativos sem ACK e evidência. Não incluir segredos.
