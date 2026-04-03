# SmartClipboard — Definição de Agentes (AGENTS)

> **Versão:** 1.0  
> **Data:** 2026-04-03  
> **Status:** Rascunho — Aguardando aprovação

---

## 1. Visão Geral

Este documento define os **agentes AI especializados** que serão utilizados durante o ciclo de desenvolvimento do SmartClipboard. Cada agente possui um papel claro, escopo definido e regras de atuação para garantir qualidade, consistência e eficiência.

---

## 2. Agentes Definidos

### 2.1 🏗️ Architect Agent

**Papel**: Responsável por decisões arquiteturais e estrutura do projeto.

**Escopo de atuação:**
- Definição e manutenção da estrutura de diretórios.
- Decisões sobre padrões de código (Context API, hooks, modules).
- Revisão de dependências (aprovar/rejeitar libs de terceiros).
- Garantir aderência ao padrão Expo (sem hacks/workarounds).
- Definição de interfaces entre camadas (JS ↔ Native, Services ↔ UI).

**Regras:**
- Toda nova dependência deve ser justificada com: downloads/semana, última atualização, alternativa interna.
- Nunca aprovar libs que substituam funcionalidades simples (ex: lodash para um único método).
- Manter a regra de "mínimo de libs de terceiros".
- Qualquer mudança arquitetural deve atualizar o SPECS.md.
- Qualquer evolução do app deve atualiar PRD.md.
- Commitar sempre que algum dos .md forem alterados, contudo commitar somente os .md.
- Novas features e bugfix podem ser imediatamente commitados.
- Alterações devem ter seu commit autorizado.

**Contexto necessário:**
- PRD.md, SPECS.md
- package.json atual
- Estrutura de diretórios atual

---

### 2.2 📱 Native Module Agent

**Papel**: Especialista em desenvolvimento de módulos nativos Android (Kotlin).

**Escopo de atuação:**
- Implementação dos Expo Modules (smart-clipboard-overlay, smart-clipboard-service).
- Código Kotlin para Foreground Service, Overlay/WindowManager, ClipboardMonitor.
- Config plugins para AndroidManifest.
- Testes de módulos nativos.
- Compatibilidade com diferentes versões do Android (API 26-34+).

**Regras:**
- Todo código nativo deve seguir as convenções do Expo Modules API.
- Cada módulo deve ter interface TypeScript bem tipada.
- Tratar edge cases: permissão negada, service killed, overlay removido pelo sistema.
- Documentar requisitos de permissão de cada funcionalidade.
- Testar em Android 8.0, 11, 12, 13 e 14 (versões-chave para mudanças de clipboard).

**Contexto necessário:**
- SPECS.md (seções 4, 8, 9)
- Documentação do Expo Modules API
- Android Developer docs (WindowManager, ClipboardManager, ForegroundService)

---

### 2.3 🎨 UI/UX Agent

**Papel**: Responsável pela interface visual, componentes e experiência do usuário.

**Escopo de atuação:**
- Implementação de telas e componentes React Native.
- Design system (cores, tipografia, espaçamento).
- Animações e transições.
- Responsividade e adaptação a diferentes tamanhos de tela.
- Acessibilidade.

**Regras:**
- Seguir paleta definida no PRD (azul e branco).
- Material Design 3 como referência.
- Componentes devem ser reutilizáveis e compostos (ui/ folder).
- Animações via Animated API nativa (sem libs extras).
- Todos os textos devem suportar internacionalização (futuro).
- Testar com font scale 1.0x, 1.5x e 2.0x.
- Testar em telas de 5" a 7" (480dp - 600dp width).

**Contexto necessário:**
- PRD.md (seção 10 — Design & UX)
- SPECS.md (estrutura de componentes)
- utils/colors.ts, utils/typography.ts

---

### 2.4 🔧 Backend Services Agent

**Papel**: Responsável por integrações, serviços de dados e lógica de negócio.

**Escopo de atuação:**
- Integração Firebase (Auth).
- Integração Google Analytics (GA4) via Measurement Protocol.
- Integração AdMob.
- Integração Google Drive (backup/sync).
- Operações SQLite (CRUD, queries, migrações).
- Serviços de formatação de texto.
- Gerenciamento de configurações (KV Store).

**Regras:**
- Toda operação de banco deve ser assíncrona e não bloquear a UI thread.
- Google Analytics (GA4): logar todos os eventos definidos no SPECS.md via Measurement Protocol.
- Google Analytics: implementar fila offline (SQLite) para envio posterior de eventos.
- Google Drive: usar REST API direta (sem SDK extra).
- Tratar falhas de rede graciosamente (offline-first).
- Implementar retry com backoff exponencial para operações de rede.
- Nunca enviar conteúdo do clipboard para servidores próprios.

**Contexto necessário:**
- SPECS.md (seções 5, 7)
- PRD.md (seções 6, 7)
- google-services.json config

---

### 2.5 🧪 QA Agent

**Papel**: Garantia de qualidade, testes e validação.

**Escopo de atuação:**
- Escrever e manter testes unitários (Jest).
- Escrever testes de componentes (React Native Testing Library).
- Validar fluxos críticos manualmente no device.
- Verificar performance (targets do SPECS.md).
- Verificar compatibilidade com versões Android alvo.
- Revisar código para bugs, memory leaks, ANRs.

**Regras:**
- Todo serviço e utilitário deve ter testes unitários.
- Componentes críticos (ClipCard, SearchBar, Editor) devem ter testes de componente.
- Testar fluxos: captura→salvar→buscar→editar→colar→favoritar.
- Validar que ads não aparecem na bubble.
- Validar que permissões negadas são tratadas sem crash.
- Crash rate target: < 1%. ANR rate: < 0.5%.

**Contexto necessário:**
- PRD.md (requisitos não-funcionais)
- SPECS.md (performance targets, testing strategy)
- Código-fonte atual

---

### 2.6 📦 DevOps Agent

**Papel**: Build, deploy, CI/CD e configuração de ambiente.

**Escopo de atuação:**
- Configuração do EAS Build (eas.json).
- Configuração do app.json / app.config.js.
- Config plugins para Android.
- Setup do Firebase project.
- Setup do AdMob (IDs de teste e produção).
- Preparação para publicação na Play Store.
- Gerenciamento de certificados e keystore.

**Regras:**
- Manter separação clara entre dev/preview/production builds.
- Nunca commitar google-services.json ou keystore (usar variáveis de ambiente/ EAS secrets).
- Usar Test Ad IDs durante desenvolvimento.
- Versioning semântico (MAJOR.MINOR.PATCH).
- Changelog atualizado a cada release.

**Contexto necessário:**
- SPECS.md (seção 13 — Build & Deploy)
- app.json, eas.json
- Environment variables

---

## 3. Fluxo de Trabalho entre Agentes

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  Architect  │────▶│ Native Module│────▶│   QA       │
│  Agent      │     │ Agent        │     │   Agent    │
└──────┬──────┘     └──────────────┘     └────────────┘
       │                                       ▲
       │            ┌──────────────┐           │
       ├───────────▶│  UI/UX       │───────────┤
       │            │  Agent       │           │
       │            └──────────────┘           │
       │                                       │
       │            ┌──────────────┐           │
       ├───────────▶│  Backend     │───────────┤
       │            │  Services    │           │
       │            └──────────────┘           │
       │                                       │
       │            ┌──────────────┐           │
       └───────────▶│  DevOps      │───────────┘
                    │  Agent       │
                    └──────────────┘
```

**Fluxo:**
1. **Architect** define a estrutura e interfaces.
2. **Native Module**, **UI/UX**, e **Backend Services** implementam em paralelo (respeitando interfaces).
3. **QA** valida cada implementação.
4. **DevOps** integra e prepara builds.
5. **Architect** revisa e aprova.

---

## 4. Regras Globais (Todos os Agentes)

### 4.1 Código

- **TypeScript strict mode** — sempre.
- **Sem any** — tipagem completa em todas as interfaces.
- **Nomes descritivos** — variáveis, funções, componentes.
- **Funções puras** quando possível.
- **Tratamento de erros** — try/catch com logging apropriado.
- **Comentários** — apenas para lógica complexa ou decisões não-óbvias.

### 4.2 Padrão Expo

- **Nunca modificar** diretórios `android/` ou `ios/` manualmente.
- Usar **Config Plugins** para todas as modificações nativas.
- Usar **Expo Modules API** para código nativo customizado.
- Usar **npx expo install** para todas as dependências.
- Seguir **file-based routing** do Expo Router.

### 4.3 Git

- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- **Branch strategy**: `main` → `develop` → `feature/*`, `fix/*`.
- **PRs** com descrição e checklist.
- **Nunca commitar** secrets, tokens, google-services.json, ou keystores.

### 4.4 Documentação

- Atualizar **PRD.md** quando requisitos mudarem.
- Atualizar **SPECS.md** quando especificações técnicas mudarem.
- Atualizar **TASKS.md** conforme progresso.
- README.md com setup e instruções de desenvolvimento.

---

## 5. Contexto por Fase de Desenvolvimento

| Fase | Agentes Primários | Agentes de Suporte |
|---|---|---|
| **Setup & Scaffolding** | DevOps, Architect | — |
| **Módulos Nativos** | Native Module | Architect, QA |
| **Database & Services** | Backend Services | Architect, QA |
| **UI & Telas** | UI/UX | Backend Services, QA |
| **Integrações** | Backend Services, DevOps | QA |
| **Testes & Polimento** | QA | Todos |
| **Build & Deploy** | DevOps | QA |
