# Farm MCP Control - MCP Server + Dashboard Administrativo

Aplicação administrativa independente para monitoramento e gestão do jogo **Hay Day Farm Simulator** através do **Model Context Protocol (MCP)** e Dashboard Web Administrativo completo.

---

## 🎨 Dashboard Administrativo Web (Etapa 6)

Acesse no navegador:
```text
https://meu-mcp.onrender.com/
```

### 📍 Rotas Frontend do Dashboard (SPA)
* `/` — **Dashboard General**: Métricas principais, ativas MCP, latência, tempo de atividade e status de todos os subsistemas (MCP Server, Game API, Database, Journal, Market).
* `/tools` — **MCP Tools**: Tabela completa das 14 ferramentas com busca, filtros por categoria/risco e **Testador Integrado de Tools READ-ONLY (LOW risk)** com histórico de testes.
* `/players` — **Jogadores**: Busca de fazendas registradas, listagem com nível/xp/status, e modal com abas de Visão Geral, Inventário/Silo/Celeiro e Diagnóstico.
* `/inventory` — **Inventário**: Consulta por ID de jogador, utilização de Silo de grãos e Celeiro com progresso visual.
* `/economy` — **Economia**: Indicadores reais do mercado e fluxo da banca.
* `/journal` — **Jornal**: Status de anúncios no jornal da comunidade e ferramenta visual de **Diagnóstico do Jornal**.
* `/market` — **Banca & Mercado**: Visão das bancas ativas e ferramenta visual de **Diagnóstico do Mercado**.
* `/server` — **Infraestrutura do Servidor**: Telemetria do processo Node.js, tempo de atividade e diagnóstico dos subsistemas.
* `/logs` — **Audit Logs**: Histórico sanitizado de execuções com busca por Request ID / Tool, filtro por status e visualizador JSON.
* `/security` — **Postura de Segurança**: Trava de execução Read-Only e verificação de status das credenciais (valores mascarados `••••••••`).
* `/settings` — **Configurações**: Parâmetros do servidor MCP e seletor de Atualização Automática (*Auto-Refresh*).
* `/admins` — **Gerenciamento de Administradores**: Listagem, criação, edição de papéis (RBAC) e desativação de contas de administradores.
* `/profile` — **Perfil & Segurança do Usuário**: Informações do usuário logado, alteração de senha e encerramento de sessões ativas.

---

## 🔐 Sistema de Autenticação & RBAC (Etapa 7)

O `mcp-admin` implementa um sistema robusto de Autenticação Administrativa e Controle de Acesso Baseado em Papéis (**RBAC**):

### 🛡️ Papéis de Usuário (Roles)
* **`OWNER`**: Acesso irrestrito ao sistema, incluindo criação, edição de papéis e remoção de outros administradores.
* **`ADMIN`**: Gestão operacional completa e execução de ferramentas MCP, sem permissão para alterar contas OWNER.
* **`SUPPORT`**: Visualização de fazendas, inventários, jornal e auditoria (leitura sem permissão para execução de tools de escrita ou gestão de admins).
* **`READONLY`**: Acesso estritamente para visualização de dashboards, gráficos e telemetria de infraestrutura.

### 🔑 Autenticação e Segurança
* **Sessão por Cookie HTTPOnly**: Cookie `admin_session` protegido contra scripts maliciosos (XSS).
* **Hash de Senha Seguro**: Senhas armazenadas via algoritmo scrypt com salt único por usuário.
* **Bootstrap Automático**: Conta principal de administrador (OWNER) provisionada na inicialização via variáveis de ambiente ou credenciais padrão.
* **Auditoria de Ações**: Todas as tentativas de login, alteração de senha, criação de usuários e execução de MCP tools registram o `adminId` no Audit Log.

---

## 🔒 Regras Fidedignas de Dados e Segurança

1. **Sem Dados Inventados**: Todas as páginas exibem exclusivamente dados provenientes das APIs reais do `mcp-admin` e backend do jogo. Quando um indicador agregado não possui integração, é exibido explicitamente: `Não disponível` ou `Integração não configurada`.
2. **Nenhum Secret no Frontend**: Nenhum token administrativo (`MCP_ACCESS_TOKEN`, `GAME_API_TOKEN`, etc.) é injetado no bundle React do frontend. O Dashboard executa chamadas através da API REST interna `/api/admin/tools/execute`.
3. **Trava de Segurança no Dashboard**: Somente ferramentas categorizadas como `LOW` e `readOnly: true` podem ser testadas via Dashboard. Operações de escrita ou de risco médio/alto são bloqueadas no backend controller.

---

## 🤖 Endpoints de API & MCP (Backend REST)

* **Endpoint MCP (SSE):** `/mcp`
* **Endpoint de Mensagens MCP:** `/mcp/messages`
* **Visão Geral Admin:** `GET /api/admin/dashboard`
* **Busca de Jogadores Admin:** `GET /api/admin/players`
* **Ficha de Jogador Admin:** `GET /api/admin/players/:id`
* **Executar Tool pelo Dashboard:** `POST /api/admin/tools/execute`
* **Logs de Auditoria:** `GET /api/admin/logs`
* **Status do Jornal Admin:** `GET /api/admin/journal`
* **Status da Banca Admin:** `GET /api/admin/market`
* **Health Check Processo:** `GET /health`
* **Readiness Check Integrações:** `GET /api/readiness`

---

## 🛠️ Ferramentas MCP Registradas (14 Ferramentas READ-ONLY)

### 📊 Servidor e Sistema (`SERVER`)
1. **`server_status`**: Retorna estado operacional, memória RSS/Heap, tempo de atividade e métricas do MCP Admin Server.
2. **`get_server_stats`**: Retorna contadores detalhados de requisições HTTP, taxas de erro e latência.

### 🎮 Jogo e Mercado (`GAME` / `MARKET`)
3. **`get_game_info`**: Consulta a saúde do backend do jogo (`/api/health`), total de fazendas e ofertas no mercado.
4. **`get_market_status`**: Analisa vendas ativas, ofertas concluídas e ranking dos itens mais vendidos.
5. **`get_market_listings`**: Filtra ofertas ativas na banca por vendedor, comprador, item ou status de venda.

### 📰 Jornal da Comunidade (`JOURNAL`)
6. **`get_journal_status`**: Diagnostica anúncios no jornal da comunidade.
7. **`get_journal_listings`**: Filtra e pesquisa ofertas publicadas no jornal.

### 👨‍🌾 Jogadores e Inventário (`PLAYERS` / `INVENTORY`)
8. **`get_online_players`**: Lista as fazendas conectadas em tempo real com níveis, avatares e curtidas.
9. **`search_players`**: Busca fazendas cadastradas por nome ou ID com paginação.
10. **`get_player`**: Consulta a estrutura detalhada, nível e slots da banca de uma fazenda via `playerId`.

### 🩺 Diagnósticos Automáticos (`DIAGNOSTICS`)
11. **`diagnose_journal`**: Diagnostica anúncios sem vendedor, preços/quantidades inválidos ou propagandas expiradas.
12. **`diagnose_market`**: Inspeciona duplicidade de caixas na banca ou compras sem comprador registrado.
13. **`diagnose_player`**: Analisa inconformidades de nível ou inconsistências estruturais na fazenda de um jogador.
14. **`diagnose_inventory`**: Inspeciona os slots de vendas em busca de itens com quantidades ou preços negativos.

---

# 🕵️‍♂️ Sistema de Logs, Auditoria, Traces e Sanitização (Etapa 8)

O `mcp-admin` conta com uma infraestrutura centralizada de rastreabilidade de ponta a ponta:

### 📜 Tipos de Log
1. **Application Logs**: Registrar eventos técnicos do sistema (`INFO`, `WARN`, `ERROR`, `CRITICAL`) como inicialização, timeouts da Game API, erros internos e reconexões.
2. **MCP Tool Logs**: Histórico completo de cada execução de ferramenta MCP (duração, status, target, contagem de resultados, parâmetros sanitizados).
3. **Audit Logs Imutáveis**: Registro à prova de adulteração de ações administrativas (`ADMIN_LOGIN`, `TOOL_EXECUTED`, `LOG_EXPORT`, `PASSWORD_CHANGED`, `PERMISSION_DENIED`, etc.).
4. **Security Logs**: Eventos de segurança (`LOGIN_SUCCESS`, `LOGIN_FAILED`, `RATE_LIMIT_HIT`, `SESSION_REVOKED`) com mascaramento automático de IP para conformidade com privacidade.

### 🛡️ Sanitização de Segredos Obrigatoria
* **Scrubbing Recursivo**: Remoção automática de palavras-chave sensíveis (`password`, `token`, `authorization`, `cookie`, `secret`, `apiKey`, `DATABASE_URL`, `mcp_access_token`, etc.) em inputs, metadata e objetos aninhados, substituindo por `[REDACTED]`.
* **Privacidade de IP**: Mascaramento para visualizações sem permissão elevada (`192.168.xxx.xxx`).

### 🔍 Correlation Trace & Métricas de Tools
* **`X-Correlation-ID` & `X-Request-ID`**: Propagados de ponta a ponta (Dashboard → Admin API → MCP Tool → Service → Game API).
* **Request Trace Timeline**: Reconstrução visual da linha do tempo cronológica com cálculo de latência relativa por Correlation ID.
* **Métricas de Latência de Tools**: Cálculo em tempo real de `calls`, `success`, `errors`, `successRate`, `averageDuration`, `p50`, `p95`, `p99` e agrupamento de incidentes recorrentes por *error fingerprint*.
* **Retenção e Limpeza Automática**: Suporte a expiração configurável por variáveis de ambiente (`LOG_RETENTION_DAYS=30`, `AUDIT_LOG_RETENTION_DAYS=180`).

---

## 🚀 Como Compilar e Executar

```bash
cd mcp-admin

# 1. Instalar dependências (Backend e Dashboard Frontend)
npm install
cd dashboard && npm install && cd ..

# 2. Executar validação de tipos e suíte de testes
npm run typecheck
npm test

# 3. Compilar Dashboard Frontend e Backend TypeScript
cd dashboard && npm run build && cd ..
npm run build

# 4. Iniciar Servidor Integrado em Produção
npm start
```

---

## 🏭 Preparação para Produção (Etapa 10)

O **MCP Admin** está pronto para ser publicado em ambiente de produção (Render / Docker / VPS).

### 📋 Documentações Técnicas e Checklists
* [SECURITY_CHECKLIST.md](file:///c:/Users/kgmf2/Downloads/teste633-main/teste633-main/mcp-admin/SECURITY_CHECKLIST.md) — Matriz completa de controles de segurança ativados.
* [PRE_DEPLOY_CHECKLIST.md](file:///c:/Users/kgmf2/Downloads/teste633-main/teste633-main/mcp-admin/PRE_DEPLOY_CHECKLIST.md) — Checklist de homologação pré-deploy no Render.
* [RECOVERY.md](file:///c:/Users/kgmf2/Downloads/teste633-main/teste633-main/mcp-admin/RECOVERY.md) — Manual de procedimentos para 10 cenários de incidentes e rotação de credenciais.

### 🔑 Variáveis de Ambiente Críticas (`NODE_ENV=production`)
| Variável | Descrição | Exemplo em Produção |
| :--- | :--- | :--- |
| `NODE_ENV` | Modo de execução | `production` |
| `PORT` | Porta HTTP | `3001` (ou fornecida pelo Render `$PORT`) |
| `CORS_ORIGIN` | Origem permitida para requisições do Dashboard | `https://admin.seu-dominio.com` |
| `MCP_ACCESS_TOKEN` | Token Bearer de alta entropia para acesso ao `/mcp` | Hash hex de 64 caracteres |
| `SESSION_SECRET` | Segredo para assinatura de cookies HTTPOnly | Hash hex de 64 caracteres |
| `ADMIN_JWT_SECRET` | Segredo JWT para assinar sessões de admin | Hash hex de 64 caracteres |
| `GAME_API_URL` | URL do backend principal do jogo | `https://api.seu-jogo.com` |
| `GAME_API_TOKEN` | Token Bearer privado da Game API | Token privado |
| `ADMIN_WRITE_MODE` | Trava de segurança para ferramentas de escrita | `false` (na subida inicial) |
| `ENABLE_DIAMOND_TOOLS` | Feature flag para operações de diamantes | `false` |
| `ENABLE_BAN_TOOLS` | Feature flag para ferramentas de banimento | `false` |

### 🛡️ Postura de Segurança e Hardening
1. **Zero Exposure of Secrets:** Nenhum segredo ou token é enviado para o bundle React do browser (`VITE_*`) nem salvo em repositório Git.
2. **Defesa em Profundidade:** Middlewares ativos tratam sanitização recursiva de logs, limitação de payload (100kb), rate limiting (200 req / 15 min), CSP estrito e HSTS de 1 ano.
3. **Validação na Inicialização:** O servidor aborta imediatamente se `SESSION_SECRET` ou `MCP_ACCESS_TOKEN` utilizarem valores fracos ou padrão em produção.
4. **Shutdown Gracioso:** O processo trata sinais `SIGTERM` / `SIGINT`, encerrando conexões ativas antes da finalização.


