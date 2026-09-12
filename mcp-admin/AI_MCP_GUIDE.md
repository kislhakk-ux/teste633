# Diretrizes de Uso de Ferramentas MCP para Agentes de IA (AI MCP Guide)

Este documento instrui agentes autônomos e LLMs sobre as melhores práticas de invocação de ferramentas no **Farm MCP Control**.

---

## 1. Princípios Fundamentais para a IA

1. **Nunca Alucinar Dados:**
   - Se o usuário perguntar sobre o estado do servidor, fazendas ou economia, você **DEVE** executar a respectiva ferramenta MCP antes de responder.
   - Caso uma ferramenta retorne `isError: true` ou status `DEGRADED`/`not_connected`, informe fielmente ao usuário que o serviço ou backend está temporariamente indisponível.

2. **Respeitar os Níveis de Risco (`riskLevel`):**
   - Ferramentas `LOW`: Podem ser executadas livremente em background para leitura e diagnósticos.
   - Ferramentas `HIGH` ou de escrita: Exigem confirmação explícita do operador humano antes da execução.

3. **Orquestração e Combinação Inteligente de Ferramentas:**
   - **Para perguntas sobre saúde geral do servidor:** Chame `server_status` + `get_game_info` + `get_server_stats`.
   - **Para auditoria de um jogador suspeito:** Chame `get_player` + `diagnose_player` + `diagnose_inventory`.
   - **Para investigar problemas no jornal comunitário:** Chame `get_journal_status` + `get_journal_listings` + `diagnose_journal`.

---

## 2. Tabela de Roteamento de Perguntas do Usuário

| Intenção do Usuário | Ferramenta MCP Recomendada | Parâmetros Requeridos |
| :--- | :--- | :--- |
| "Qual é o status do servidor do jogo?" | `server_status`, `get_game_info` | Nenhum `{}` |
| "Quantos jogadores estão conectados agora?" | `get_online_players` | `{ limit: 20 }` |
| "Consulte a fazenda / jogador X" | `get_player` | `{ playerId: "ID_OU_NOME" }` |
| "Procure por jogadores chamados Y" | `search_players` | `{ query: "Y" }` |
| "O que está sendo anunciado no jornal?" | `get_journal_listings` | `{ limit: 10 }` |
| "Por que o jornal não está atualizando?" | `diagnose_journal` | Nenhum `{}` |
| "Audite a banca de vendas e economia" | `get_market_status`, `diagnose_market` | Nenhum `{}` |
| "Inspecione se o jogador X tem estoques negativos" | `diagnose_inventory` | `{ playerId: "ID_DO_JOGADOR" }` |

---

## 3. Formato das Respostas para o Usuário

Sempre formate a resposta final com clareza, utilizando tabelas ou listas com marcadores claros e destacando métricas reais extraídas do JSON retornado pelas ferramentas.
