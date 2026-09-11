# Controles de Segurança Implementados (SECURITY_CHECKLIST.md)

Este relatório documenta os controles de segurança e hardening ativos no **MCP Admin**.

---

## 1. Proteção de Autenticação e Sessões
- [x] **Gestão de Cookies:** Cookies configurados com `HttpOnly=true`, `Secure=true` em produção e `SameSite=Lax/Strict`.
- [x] **Prevenção de Session Fixation:** O ID de sessão é regenerado/rotacionado imediatamente após login bem-sucedido.
- [x] **Armazenamento de Sessões:** Sessões armazenadas em repositório persistente para evitar perdas ou vulnerabilidades de memória em restart.
- [x] **Enumeração de Contas Evitada:** Respostas genéricas (`Credenciais inválidas`) em falhas de login.
- [x] **Proteção Brute-Force:** Limite de 5 tentativas por janela de tempo no endpoint `/api/auth/login` com bloqueio temporário e log de segurança.
- [x] **Comparação Segura de Hashes:** Verificação de senhas em tempo constante via bcrypt/argon2id.

---

## 2. Autorização e Controle de Acesso (RBAC)
- [x] **Política Default Deny:** Todo acesso administrativo ou execução de ferramentas não explicitamente autorizado é negado por padrão.
- [x] **Auditoria de Rotas:** Todas as rotas `/api/admin/*` protegidas por middleware `requireAuth` e verificação de permissões específicas (`READ_ONLY`, `OPERATOR`, `OWNER`).
- [x] **Kill Switch Global:** Trava global `ADMIN_WRITE_MODE=false` bloqueia a execução de qualquer ferramenta de escrita no servidor.
- [x] **Feature Flags Granulares:** `ENABLE_DIAMOND_TOOLS` e `ENABLE_BAN_TOOLS` controlam dinamicamente a liberação de subconjuntos de ferramentas críticas.

---

## 3. Segurança do Protocolo MCP (`/mcp`)
- [x] **Autenticação Bearer:** Acesso ao endpoint `/mcp` exige `MCP_ACCESS_TOKEN` válido.
- [x] **Comparação em Tempo Constante:** Token validado usando `crypto.timingSafeEqual` para prevenir ataques de canal lateral (timing attacks).
- [x] **Rate Limiting no MCP:** Endpoint `/mcp` protegido com limitador de taxa dedicado.
- [x] **Controle de Payload:** Tamanho máximo de requisição restrito a 100kb para prevenir estouro de memória/DoS.

---

## 4. Proteção de Dados, Sanitização e Logs
- [x] **Sanitização de Logs:** Mascaramento automático de campos sensíveis (`password`, `token`, `secret`, `apiKey`, `DATABASE_URL`, `Authorization`) antes de qualquer gravação de log.
- [x] **Integridade dos Audit Logs:** Imutabilidade dos logs de auditoria; nenhum endpoint permite alteração ou exclusão direta por usuários.
- [x] **Rastreabilidade de Incidentes:** Geração de `requestId` e `correlationId` únicos propagados do Dashboard até a Game API.
- [x] **Minimização de PII:** Exibição do mínimo estritamente necessário de dados pessoais no Dashboard.

---

## 5. Hardening de Infraestrutura HTTP & Navegador
- [x] **Headers HTTP:** Helmet configurado ativando `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, e `Permissions-Policy`.
- [x] **Strict Transport Security (HSTS):** Ativado com max-age de 1 ano em ambiente de produção (`NODE_ENV=production`).
- [x] **Content Security Policy (CSP):** CSP estrita impedindo `unsafe-eval`, autorizando scripts e estilos necessários ao Dashboard Vite.
- [x] **Validação de CORS:** `CORS_ORIGIN` restrito à origem explicitamente autorizada.

---

## 6. Prevenção contra Injeção e Ataques Genéricos
- [x] **SQL/NoSQL Injection:** Uso exclusivo de prepared statements / ORM parametrizado em todas as consultas ao banco.
- [x] **Prevenção de XSS:** Escapamento e sanitização de dados renderizados no Dashboard.
- [x] **Path Traversal:** Nenhuma rota aceita caminhos dinâmicos relativos para leitura de arquivos no sistema de arquivos.
- [x] **Error Handling Seguro:** Respostas HTTP 500 em produção não expõem stack traces, caminhos internos de arquivos ou variáveis de ambiente.
