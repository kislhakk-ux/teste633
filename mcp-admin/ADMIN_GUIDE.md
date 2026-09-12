# Guia do Administrador - MCP Admin & Painel Web

Manual operacional para administradores humanos e operadores do sistema.

---

## 1. Acesso ao Painel Web

- **URL de Produção:** `https://<SEU_DOMINIO_RENDER>.onrender.com/login`
- **URL Local:** `http://localhost:3001/login`
- **Credenciais Padrão do OWNER Inicial:**
  - **E-mail:** `admin@farmcontrol.com`
  - **Senha Inicial:** `Admin@123456`

> [!WARNING]
> Recomenda-se alterar a senha do usuário OWNER no primeiro acesso em ambiente produtivo ou definir via variável `BOOTSTRAP_OWNER_PASSWORD`.

---

## 2. Visão Geral dos Módulos

### 📊 Dashboard / Overview
- Apresenta o status em tempo real de todos os serviços (MCP Server, Backend do Jogo, Banco de Dados, Sincronização de Rede).
- Contadores de requisições, latência média e taxa de sucesso nas últimas 24 horas.

### 🌾 Jogadores & Fazendas (`/players`)
- Busca de jogadores por ID ou Nome.
- Visualização de nível da fazenda, avatar, data da última conexão e curtidas recebidas.
- Diagnóstico rápido de perfil.

### 📦 Inventário & Bancas (`/inventory`)
- Inspeção de ofertas publicadas na banca de beira de estrada.
- Auditoria de itens, quantidades e preços praticados por cada jogador.

### 📰 Jornal Comunitário (`/journal`)
- Monitoramento dos classificados do jornal multiplayer.
- Inspeção de ofertas ativas de NPCs e jogadores reais.

### 🏪 Banca de Vendas (`/market`)
- Histórico de vendas e notificações pendentes.
- Verificação de integridade das transações entre vizinhos.

### 🛠️ Testador de Ferramentas MCP (`/tools`)
- Interface gráfica para execução manual e validação de todas as 14 ferramentas MCP registradas.
- Visualização direta dos parâmetros de entrada, descrição, categoria e nível de risco.

### 📜 Auditoria e Logs Estruturados (`/logs`)
- Filtro avançado por nível de severidade (`INFO`, `WARN`, `ERROR`), `requestId` e `correlationId`.
- Rastreamento ponta a ponta de requisições HTTP e invocações de IA/MCP.

---

## 3. Políticas de Segurança e Modos de Operação

### Trava de Escrita (`ADMIN_WRITE_MODE`)
- Por padrão de partida segura, o sistema inicia com `ADMIN_WRITE_MODE=false`.
- Enquanto estiver desativado, qualquer operação que altere dados ou saldos no jogo é bloqueada com retorno controlado de segurança.

### Ativação Manual de Modos Especiais:
Para habilitar ferramentas administrativas de escrita ou modificação econômica em ambiente controlado:
1. Acesse as variáveis de ambiente no Render.
2. Altere `ADMIN_WRITE_MODE=true`.
3. Reinicie a aplicação de forma segura.
