# Plano de Recuperação e Manutenção de Segurança (RECOVERY.md)

Este documento descreve os procedimentos formais para mitigação, recuperação de desastres e gestão de incidentes do **MCP Admin**.

---

## 1. Cenários de Incidente e Ações de Recuperação

### Cenário 1: MCP Server Indisponível
- **Sintoma:** Dashboard/Clientes AI recebem HTTP 503/504 ou connection refused no endpoint `/mcp`.
- **Ação:**
  1. Verificar logs do processo em busca de erros não tratados (`uncaughtException` ou `unhandledRejection`).
  2. Testar o endpoint `/health` para confirmar liveness.
  3. Reiniciar o serviço via painel Render ou CLI.
  4. Se o problema persistir, isolar falhas de memória usando `LOG_LEVEL=debug`.

### Cenário 2: Dashboard Indisponível (Frontend)
- **Sintoma:** Dashboard não carrega, exibe erro 404, erro de asset ou tela em branco.
- **Ação:**
  1. Confirmar se os arquivos estáticos compilados em `dashboard/dist` estão presentes na raiz do build.
  2. Verificar CSP (Content Security Policy) no console do navegador para garantir que recursos não estejam sendo bloqueados.
  3. Limpar cache de CDN/Browser e realizar redeploy do frontend.

### Cenário 3: Banco de Dados Indisponível / Erro de Conexão
- **Sintoma:** Falha em rotas de auth (`/api/auth/login`), logs não persistem e endpoint `/api/readiness` reporta `db: unavailable`.
- **Ação:**
  1. Verificar a `DATABASE_URL` e a acessibilidade da rede.
  2. Se usando SQLite local em volume persistente, checar permissões de escrita em `./data/mcp_admin.db`.
  3. Executar o script de diagnóstico de integridade de banco de dados.

### Cenário 4: Game API Indisponível
- **Sintoma:** Execução de tools do jogo falha com timeout ou `GAME_API_UNAVAILABLE`.
- **Ação:**
  1. Verificar conectividade de saída e status da Game API (`GAME_API_URL`).
  2. Confirmar a validade do `GAME_API_TOKEN`.
  3. O MCP Admin permanecerá operacional para operações de leitura interna, registrando falhas no log de erros.

### Cenário 5: Conta de Administrador (OWNER) Perdeu Acesso
- **Sintoma:** Esquecimento de senha ou bloqueio por tentativas fracassadas.
- **Ação:**
  1. Executar o script CLI de bootstrap de conta administrativa via terminal/SSH:
     ```bash
     npm run seed:owner -- --force-reset
     ```
  2. Um novo hash seguro será gerado e exibido temporariamente no terminal de comando.

### Cenário 6: Token de Acesso MCP Vazado (`MCP_ACCESS_TOKEN`)
- **Sintoma:** Logs indicam chamadas ao `/mcp` a partir de IPs desconhecidos.
- **Ação:**
  1. Gerar imediatamente um novo token de 256 bits com entropia forte:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
  2. Atualizar a variável de ambiente `MCP_ACCESS_TOKEN` nas configurações de produção do Render.
  3. Reiniciar a aplicação para invalidar conexões e tokens antigos.
  4. Revisar os logs auditados (`mcp_tool_logs`) para verificar chamadas não autorizadas durante a janela do vazamento.

### Cenário 7: Conta Admin Comprometida
- **Sintoma:** Alterações não autorizadas em permissões, execuções indevidas de ferramentas de escrita ou auditoria suspeita.
- **Ação:**
  1. Bloquear/desativar a conta afetada através do endpoint `/api/admin/users/:id/disable` ou banco de dados (`active = false`).
  2. Invalidação imediata de todas as sessões ativas daquele usuário (`logStore.revokeAllSessions(userId)`).
  3. Alterar imediatamente as senhas de todas as contas administrativas.
  4. Rotacionar `ADMIN_JWT_SECRET` e `ADMIN_SESSION_SECRET` no ambiente.

### Cenário 8: Deploy com Defeito / Regressão Crítica
- **Sintoma:** Aplicação falha na inicialização ou quebra rotas críticas após deploy.
- **Ação:**
  1. Executar Rollback instantâneo no Render para a última compilação bem-sucedida (Last Known Good Commit).
  2. Investigar o problema no ambiente de staging/local.

### Cenário 9: Migration de Banco Mal-Sucedida
- **Sintoma:** Erro de esquema de dados durante a inicialização.
- **Ação:**
  1. Executar rollback da migration se disponível ou restaurar o último snapshot do banco de dados antes da migration.
  2. Corrigir o arquivo de migration e re-testar localmente em ambiente isolado antes de aplicar novamente em produção.

### Cenário 10: Execução Errada de Tool Administrativa
- **Sintoma:** Injeção indevida de moedas, banimento incorreto de jogador ou alteração indesejada de estado.
- **Ação:**
  1. Consultar a tabela de Audit Logs (`audit_logs`) utilizando o `correlationId` do incidente para identificar os parâmetros exatos.
  2. Ativar temporariamente a trava global de escrita:
     ```env
     ADMIN_WRITE_MODE=false
     ```
  3. Executar ferramentas de mitigação/compensação ou restaurar o snapshot do banco de dados correspondente.

---

## 2. Procedimento Detalhado de Rotação de Token (`MCP_ACCESS_TOKEN` / `GAME_API_TOKEN`)

1. **Geração:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. **Atualização das Variáveis no Render:**
   - Navegue até **Environment Settings** do serviço no Render.
   - Atualize `MCP_ACCESS_TOKEN` / `GAME_API_TOKEN` com o novo valor.
3. **Redeploy / Restart:**
   - Acione "Manual Deploy" ou "Restart Service".
4. **Validação:**
   - Teste chamadas `/mcp` com o token novo para garantir `200 OK`.
   - Confirme que chamadas com o token antigo retornam `401 Unauthorized`.

---

## 3. Procedimento de Restauração de Banco de Dados

1. **Paralisar Escrita:**
   Defina `ADMIN_WRITE_MODE=false` e reinicie o serviço.
2. **Backup Pré-Restauração:**
   Copie o banco atual para inspeção forense (`cp data/mcp_admin.db data/mcp_admin_corrupted.bak`).
3. **Substituição:**
   Substitua `./data/mcp_admin.db` pelo arquivo de backup limpo e verificado.
4. **Validação:**
   Execute a checagem de leitura `/api/readiness` e confirme a consistência dos logs de auditoria.
5. **Reativação:**
   Restaure `ADMIN_WRITE_MODE=true` após verificação completa.
