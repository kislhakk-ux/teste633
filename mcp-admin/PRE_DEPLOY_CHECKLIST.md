# Pre-Deploy Checklist - MCP Admin (Render)

Antes de realizar o primeiro deploy do **MCP Admin** no Render ou acionar a Etapa 11, confirme a verificação de todos os itens abaixo:

---

## Validacao Tecnica de Build & Testes
- [ ] **Typecheck Backend:** `npm run typecheck` executado sem nenhum erro de compilação TypeScript.
- [ ] **Typecheck Dashboard:** `npm run --prefix dashboard typecheck` validado com 0 erros.
- [ ] **Suíte de Testes:** `npm test` executado com 100% de aprovação nas suítes de testes unitários e de integração.
- [ ] **Build de Produção:** `npm run build` e `npm run dashboard:build` concluídos gerando bundles minificados na pasta `dist/` e `dashboard/dist/`.
- [ ] **Smoke Test em Produção:** `NODE_ENV=production npm start` executado com sucesso e subida limpa do servidor.

---

## Configuracao de Segredo & Ambiente
- [ ] **Variáveis de Ambiente:** Nenhuma secret exposta no código fonte ou versionada no Git.
- [ ] **MCP Access Token:** `MCP_ACCESS_TOKEN` configurado com valor de alta entropia (mínimo 32 bytes hex).
- [ ] **Segredos de Autenticação:** `SESSION_SECRET` e `ADMIN_JWT_SECRET` alterados dos valores padrão.
- [ ] **Game API Token:** `GAME_API_TOKEN` configurado nas variáveis privadas do Render.

---

## Seguranca & Hardening
- [ ] **CORS Configurado:** `CORS_ORIGIN` restrito à URL exata do dashboard de produção (sem uso de `*`).
- [ ] **Headers de Segurança:** CSP, HSTS, X-Content-Type-Options e Referrer-Policy ativados no middleware.
- [ ] **Write Mode Inicial:** `ADMIN_WRITE_MODE=false` ativado na primeira subida para prevenir alterações indesejadas até validação manual pós-deploy.
- [ ] **Feature Flags:** `ENABLE_DIAMOND_TOOLS=false` e `ENABLE_BAN_TOOLS=false` configurados para partida segura.

---

## Banco de Dados & Autenticacao
- [ ] **Estrutura de Banco:** Migrations de banco de dados SQLite/PostgreSQL aplicadas e validadas.
- [ ] **Conta OWNER Inicial:** Script de criação da conta OWNER executado com senha forte e única.
- [ ] **Proteção de Senhas:** Hashes salvos com Bcrypt / Argon2id com parâmetro de custo configurado.

---

## Health Checks & Prontidao
- [ ] **Health Check Endpoint:** Rotas `/health` e `/api/readiness` respondendo `200 OK`.
- [ ] **Log Retention:** `LOG_RETENTION_DAYS=30` e `AUDIT_LOG_RETENTION_DAYS=180` devidamente configurados.

---

**Status Final do Checklist:** `PRONTO PARA ETAPA 11 (DEPLOY NO RENDER)`
