# SmartClipboard — Tarefas de Desenvolvimento (TASKS)

> **Versão:** 1.0  
> **Data:** 2026-04-03  
> **Status:** Rascunho — Aguardando aprovação

---

## Legenda

- `[ ]` — Pendente
- `[/]` — Em progresso
- `[x]` — Concluído
- `[!]` — Bloqueado / Requer decisão
- **P0** = Essencial MVP | **P1** = Importante | **P2** = Desejável

---

## Fase 1: Setup & Scaffolding

**Agentes**: DevOps, Architect

### 1.1 Inicialização do Projeto
- [ ] Criar projeto Expo com TypeScript (`npx create-expo-app@latest ./`)
- [ ] Configurar `tsconfig.json` (strict mode)
- [ ] Configurar `app.json` / `app.config.js` (nome, ícone, splash, permissions)
- [ ] Configurar `.gitignore` (node_modules, android/, ios/, google-services.json, keystores)
- [ ] Inicializar repositório Git (`git init`, primeiro commit)
- [ ] Criar estrutura de branch (`main` → `develop`)
- [ ] Criar README.md com instruções de setup

### 1.2 Estrutura de Diretórios
- [ ] Criar diretórios: `app/`, `components/`, `contexts/`, `hooks/`, `services/`, `modules/`, `plugins/`, `utils/`, `types/`, `assets/`
- [ ] Criar sub-diretórios: `components/ui/`, `components/clip/`, `components/editor/`, `components/common/`
- [ ] Criar sub-diretórios: `app/categories/`, `app/settings/`, `app/editor/`

### 1.3 Configuração de Build
- [ ] Instalar `expo-dev-client`
- [ ] Configurar `eas.json` (profiles: development, preview, production)
- [ ] Fazer primeiro `npx expo prebuild --platform android`
- [ ] Validar build de desenvolvimento no device/emulador

### 1.4 Design Tokens
- [ ] Criar `utils/colors.ts` (paleta azul/branco definida no PRD)
- [ ] Criar `utils/typography.ts` (font families, sizes, weights)
- [ ] Criar `utils/constants.ts` (spacing, sizing, border radius)

---

## Fase 2: Módulos Nativos (P0)

**Agentes**: Native Module, Architect

### 2.1 Expo Module: smart-clipboard-service
- [ ] Criar módulo local (`npx create-expo-module@latest --local`)
- [ ] Implementar `ClipboardForegroundService.kt`
  - [ ] Notification channel setup
  - [ ] `startForeground()` com notificação persistente
  - [ ] Lifecycle management (start/stop)
- [ ] Implementar `ClipboardMonitor.kt`
  - [ ] Registrar `OnPrimaryClipChangedListener`
  - [ ] Emitir eventos para JS ao detectar mudança
  - [ ] Leitura de clipboard em contexto foreground
- [ ] Implementar `SmartClipboardServiceModule.kt`
  - [ ] `startService()`, `stopService()`, `isServiceRunning()`
  - [ ] `getClipboardContent()`, `setClipboardContent()`
  - [ ] Eventos: `onClipboardChange`
- [ ] Criar interface TypeScript (`index.ts`)
- [ ] Testar em Android 8.0 (API 26)
- [ ] Testar em Android 12 (API 31) — toast de clipboard
- [ ] Testar em Android 14 (API 34) — foreground service type

### 2.2 Expo Module: smart-clipboard-overlay
- [ ] Criar módulo local (`npx create-expo-module@latest --local`)
- [ ] Implementar `BubbleView.kt`
  - [ ] Layout XML / composição da view
  - [ ] Ícone circular com animação de pulse
  - [ ] Touch listeners (tap, long press, drag)
- [ ] Implementar `BubbleService.kt`
  - [ ] `WindowManager.addView()` com `TYPE_APPLICATION_OVERLAY`
  - [ ] LayoutParams configuráveis (posição, tamanho, opacidade)
  - [ ] Drag & drop com limites de tela
  - [ ] Expansão para painel (estado expandido)
- [ ] Implementar `SmartClipboardOverlayModule.kt`
  - [ ] `showBubble()`, `hideBubble()`, `isBubbleVisible()`
  - [ ] `setBubblePosition()`, `setBubbleSize()`, `setBubbleOpacity()`
  - [ ] Eventos: `onBubbleTap`, `onBubbleLongPress`, `onBubbleDragEnd`, `onClipboardChanged`
- [ ] Criar interface TypeScript (`index.ts`)
- [ ] Testar em múltiplas dimensões de tela
- [ ] Testar interação com apps populares (WhatsApp, Chrome, etc.)

### 2.3 Config Plugin
- [ ] Criar `plugins/withSmartClipboard.js`
  - [ ] Injetar permissões no AndroidManifest
  - [ ] Registrar service no AndroidManifest
  - [ ] Configurar `foregroundServiceType` (API 34+)
- [ ] Validar que `npx expo prebuild` aplica corretamente
- [ ] Documentar permissões necessárias

---

## Fase 3: Database & Serviços (P0)

**Agentes**: Backend Services, Architect

### 3.1 Database (SQLite)
- [ ] Instalar `expo-sqlite` (`npx expo install expo-sqlite`)
- [ ] Implementar `services/database.ts`
  - [ ] Inicialização do banco com schema (tabelas, índices)
  - [ ] Migrações versionadas
  - [ ] CRUD de clips
  - [ ] CRUD de categorias
  - [ ] CRUD de templates
  - [ ] Queries: buscar por texto, filtrar por favorito/categoria, paginação
  - [ ] Limpeza automática (respeitar `history_max_items`)
- [ ] Criar hook `hooks/useDatabase.ts`
- [ ] Testes unitários para todas as operações CRUD

### 3.2 Configurações (KV Store)
- [ ] Implementar via `expo-sqlite/kv-store`
- [ ] Definir valores padrão para todas as configurações
- [ ] Criar `contexts/SettingsContext.tsx`
- [ ] Criar hook `hooks/useSettings.ts`
- [ ] Testes unitários

### 3.3 Serviço de Formatação de Texto
- [ ] Implementar `services/formatting.ts`
  - [ ] `toUpperCase()`, `toLowerCase()`, `toTitleCase()`
  - [ ] `trimWhitespace()`, `removeExtraSpaces()`, `removeLineBreaks()`
  - [ ] `reverseText()`, `countWords()`, `countChars()`
  - [ ] `mergeTexts(texts[], separator)`
- [ ] Testes unitários para cada função

### 3.4 Serviço de Clipboard (JS Layer)
- [ ] Implementar wrapper sobre módulo nativo + expo-clipboard
- [ ] Criar `contexts/ClipboardContext.tsx`
  - [ ] Estado: clips recentes, último clip, contagem
  - [ ] Actions: capturar, salvar, deletar, favoritar, pinar
- [ ] Criar hook `hooks/useClipboard.ts`
- [ ] Integrar com SQLite para persistência
- [ ] Testes unitários

---

## Fase 4: Autenticação (P0)

**Agentes**: Backend Services, DevOps

### 4.1 Firebase Setup
- [ ] Criar projeto no Firebase Console
- [ ] Ativar Authentication (provider: Google)
- [ ] Gerar e baixar `google-services.json`
- [ ] Configurar SHA-1 do app no Firebase Console

### 4.2 Integração Firebase Auth
- [ ] Instalar `@react-native-firebase/app`, `@react-native-firebase/auth`
- [ ] Instalar `@react-native-google-signin/google-signin`
- [ ] Configurar config plugins em `app.json`
- [ ] Implementar `contexts/AuthContext.tsx`
  - [ ] Estado: user, isAuthenticated, isLoading
  - [ ] Actions: signInWithGoogle, signOut
  - [ ] Listener: `onAuthStateChanged`
- [ ] Armazenar tokens em `expo-secure-store`
- [ ] Modo offline (app funciona sem login)
- [ ] Testar fluxo completo: login → sessão → logout
- [ ] Testar edge cases: rede indisponível, token expirado, login cancelado

---

## Fase 5: UI & Telas (P0/P1)

**Agentes**: UI/UX, Backend Services

### 5.1 Componentes Base (ui/)
- [ ] `Button` (variantes: primary, secondary, outline, ghost)
- [ ] `Card` (com sombra, borda, variantes)
- [ ] `Input` (text input com ícones, estados de erro)
- [ ] `SearchBar` (com debounce, ícone de busca/limpar)
- [ ] `Badge` (para categorias, contadores)
- [ ] `Chip` (toggleable, deletable)
- [ ] `EmptyState` (ícone + mensagem + CTA)
- [ ] `Loading` (spinner, skeleton)
- [ ] `SwipeableRow` (ações de swipe: deletar, favoritar)

### 5.2 Componentes de Clip (clip/)
- [ ] `ClipCard` (preview do texto, timestamp, ícones de ação)
- [ ] `ClipList` (FlatList otimizada com paginação)
- [ ] `ClipActions` (copiar, editar, favoritar, deletar, categorizar)

### 5.3 Tela: Home / Histórico (index.tsx)
- [ ] Header com logo, título, ícone de configurações
- [ ] SearchBar no topo
- [ ] ClipList com scroll infinito
- [ ] Filtros rápidos (Todos, Favoritos, Fixados)
- [ ] FAB (Floating Action Button) para colar manualmente
- [ ] Pull-to-refresh
- [ ] EmptyState quando sem clips

### 5.4 Tela: Favoritos (favorites.tsx)
- [ ] Lista filtrada de clips favoritos
- [ ] Mesmos componentes da Home
- [ ] EmptyState específico

### 5.5 Tela: Editor ([id].tsx)
- [ ] TextInput editável com conteúdo do clip
- [ ] Barra de ferramentas de formatação
  - [ ] Uppercase / Lowercase / Title Case
  - [ ] Trim / Remove espaços / Remove quebras
  - [ ] Contadores (chars, words)
- [ ] Botão Salvar / Copiar / Cancelar
- [ ] Preview em tempo real

### 5.6 Tela: Configurações (settings/)
- [ ] `settings/index.tsx` — Lista de opções (conta, bubble, backup, sobre)
- [ ] `settings/bubble.tsx` — Config da bubble (ativar/desativar, tamanho, opacidade)
- [ ] `settings/backup.tsx` — Config de backup (manual, automático, restaurar)
- [ ] `settings/account.tsx` — Login/logout, info da conta

### 5.7 Tela: Onboarding (onboarding.tsx)
- [ ] Explicação do app (2-3 slides)
- [ ] Solicitação de permissão SYSTEM_ALERT_WINDOW
- [ ] Solicitação de permissão POST_NOTIFICATIONS (API 33+)
- [ ] Botão "Começar" ativa o serviço

### 5.8 Layout & Navegação
- [ ] `_layout.tsx` — Root layout com providers (Auth, Settings, Clipboard)
- [ ] Tab navigation (Home, Favoritos, Categorias, Configurações)
- [ ] Ícones nas tabs
- [ ] Stack navigation para sub-telas (editor, detalhes)

---

## Fase 6: Categorias & Templates (P2)

**Agentes**: UI/UX, Backend Services

### 6.1 Categorias
- [ ] Tela `categories/index.tsx` — Lista de categorias
- [ ] Tela `categories/[id].tsx` — Clips de uma categoria
- [ ] Modal para criar/editar categoria (nome, cor, ícone)
- [ ] Atribuir categoria a um clip
- [ ] Filtrar clips por categoria

### 6.2 Templates
- [ ] Tela `templates.tsx` — Lista de templates
- [ ] Modal para criar/editar template
- [ ] Uso de template: selecionar → editar placeholders → copiar

---

## Fase 7: Google Analytics — GA4 (P0)

**Agentes**: Backend Services

### 7.1 Implementação do Analytics Service
- [ ] Criar `services/analytics.ts`
  - [ ] Configuração do Measurement Protocol v2
  - [ ] Geração e persistência de `client_id` (UUID por instalação)
  - [ ] Função `trackEvent(name, params)` genérica
  - [ ] Funções tipadas para cada evento definido no SPECS
  - [ ] Respeitar `analytics_opted_in` do usuário
- [ ] Implementar fila offline (SQLite)
  - [ ] Tabela `analytics_queue` (event_name, params_json, created_at, sent)
  - [ ] Enfileirar quando offline
  - [ ] Drenar fila ao restaurar conexão (lotes de 25)
  - [ ] Retry com backoff exponencial
- [ ] Integrar tracking em todas as telas e ações
- [ ] Testes unitários do service

### 7.2 Configuração GA4
- [ ] Criar propriedade GA4 no Google Analytics Console
- [ ] Obter `measurement_id` e `api_secret`
- [ ] Armazenar `api_secret` via variável de ambiente / EAS secrets
- [ ] Validar eventos no GA4 DebugView

---

## Fase 8: AdMob (P1)

**Agentes**: Backend Services, DevOps

### 8.1 Setup
- [ ] Criar conta AdMob (se não existir)
- [ ] Registrar o app no AdMob Console
- [ ] Obter App ID e Ad Unit IDs (banner, intersticial)
- [ ] Instalar `react-native-google-mobile-ads`
- [ ] Configurar App ID no `app.json`

### 8.2 Implementação
- [ ] Criar `services/ads.ts`
  - [ ] Inicialização do AdMob SDK
  - [ ] Wrapper para banner ads
  - [ ] Wrapper para intersticial ads
  - [ ] Controle de frequência (max 1 intersticial / 3 min)
- [ ] Integrar banner na Home (rodapé)
- [ ] Integrar intersticial ao abrir o app
- [ ] Garantir: NENHUM ad na bubble/overlay
- [ ] Usar Test Ad IDs durante desenvolvimento
- [ ] Testar em device real

---

## Fase 9: Google Drive — Backup & Sync (P1)

**Agentes**: Backend Services

### 9.1 Implementação
- [ ] Criar `services/backup.ts`
  - [ ] Serializar dados: clips + categories + templates → JSON
  - [ ] Comprimir com gzip
  - [ ] Upload para Google Drive AppData folder (REST API)
  - [ ] Download de backup existente
  - [ ] Restaurar dados (desserializar + insert no SQLite)
  - [ ] Listar backups disponíveis
  - [ ] Deletar backups antigos
- [ ] Criar hook `hooks/useBackup.ts`
- [ ] Integrar com AuthContext (requer login)
- [ ] Backup manual (botão em settings/backup)
- [ ] Auto-backup periódico (se configurado)
- [ ] Tratamento de erros de rede
- [ ] Testes do fluxo backup → restaurar

---

## Fase 10: Polimento & QA

**Agentes**: QA, UI/UX, todos

### 10.1 Testes
- [ ] Testes unitários: services/ (database, formatting, analytics, backup)
- [ ] Testes unitários: utils/ (validators, constants)
- [ ] Testes de componentes: ClipCard, SearchBar, Button, Input
- [ ] Teste manual: fluxo completo (captura → salvar → buscar → editar → colar → favoritar)
- [ ] Teste manual: permissões negadas
- [ ] Teste manual: app sem login (modo offline)
- [ ] Teste manual: backup e restauração
- [ ] Teste manual: bubble em diferentes apps
- [ ] Teste em Android 8.0, 11, 12, 13, 14

### 10.2 Performance
- [ ] Verificar cold start < 2s
- [ ] Verificar bubble response < 100ms
- [ ] Verificar busca < 200ms (500 itens)
- [ ] Verificar consumo de RAM (service idle < 30MB)
- [ ] Profile de bateria

### 10.3 Polimento UI
- [ ] Revisar animações e transições
- [ ] Verificar paleta de cores consistente
- [ ] Verificar tipografia consistente
- [ ] Testar font scale 1.0x, 1.5x, 2.0x
- [ ] Testar em telas 5" - 7"
- [ ] Verificar acessibilidade (contrast ratios, labels)

### 10.4 Estabilidade
- [ ] Tratar todos os edge cases identificados
- [ ] Verificar que não há memory leaks
- [ ] Verificar que foreground service não é killed
- [ ] Crash handling com logging
- [ ] Error boundaries em componentes React

---

## Fase 11: Build & Deploy

**Agentes**: DevOps, QA

### 11.1 Preparação
- [ ] Criar ícone do app (múltiplas resoluções)
- [ ] Criar splash screen
- [ ] Criar assets para Play Store (screenshots, feature graphic, ícone)
- [ ] Escrever descrição do app (PT-BR, EN)
- [ ] Criar política de privacidade (LGPD)
- [ ] Configurar versioning (1.0.0)

### 11.2 Build de Produção
- [ ] Build via EAS (`eas build --platform android --profile production`)
- [ ] Testar AAB em device real
- [ ] Validar google-services.json de produção
- [ ] Validar AdMob IDs de produção
- [ ] Validar GA4 measurement_id de produção

### 11.3 Publicação
- [ ] Criar conta no Google Play Console (se não existir)
- [ ] Criar listagem do app
- [ ] Upload do AAB
- [ ] Configurar releases (internal testing → closed → open → production)
- [ ] Submit para revisão
- [ ] Monitorar feedback e métricas pós-launch

---

## Dependências entre Fases

```
Fase 1 (Setup)
    │
    ├──→ Fase 2 (Módulos Nativos)
    │         │
    │         └──→ Fase 5 (UI — depende de módulos para bubble/overlay)
    │
    ├──→ Fase 3 (Database & Services)
    │         │
    │         ├──→ Fase 5 (UI — depende de services para dados)
    │         ├──→ Fase 7 (Analytics — usa SQLite para fila offline)
    │         └──→ Fase 9 (Backup — depende de database)
    │
    ├──→ Fase 4 (Auth)
    │         │
    │         ├──→ Fase 5 (UI — AuthContext nas telas)
    │         └──→ Fase 9 (Backup — requer autenticação)
    │
    ├──→ Fase 6 (Categorias — depende de Fase 3 + 5)
    │
    ├──→ Fase 8 (AdMob — pode ser implementado após UI base)
    │
    └──→ Fase 10 (QA — após todas as features)
              │
              └──→ Fase 11 (Deploy — após QA)
```

---

## Estimativa de Esforço

| Fase | Estimativa | Status |
|---|---|---|
| Fase 1: Setup & Scaffolding | 1-2 dias | Pendente |
| Fase 2: Módulos Nativos | 5-8 dias | Pendente |
| Fase 3: Database & Services | 3-4 dias | Pendente |
| Fase 4: Autenticação | 2-3 dias | Pendente |
| Fase 5: UI & Telas | 5-7 dias | Pendente |
| Fase 6: Categorias & Templates | 2-3 dias | Pendente |
| Fase 7: Google Analytics | 2-3 dias | Pendente |
| Fase 8: AdMob | 1-2 dias | Pendente |
| Fase 9: Google Drive Backup | 3-4 dias | Pendente |
| Fase 10: QA & Polimento | 3-5 dias | Pendente |
| Fase 11: Build & Deploy | 2-3 dias | Pendente |
| **Total estimado** | **29-44 dias** | — |
