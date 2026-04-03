# SmartClipboard — Especificações Técnicas (SPECS)

> **Versão:** 1.0  
> **Data:** 2026-04-03  
> **Status:** Rascunho — Aguardando aprovação

---

## 1. Decisão de Framework: Expo (React Native)

### 1.1 Análise Comparativa

| Critério | Expo (React Native) | React + Capacitor |
|---|---|---|
| **Rendering** | Nativo (UI thread) | WebView |
| **Performance de UI** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Acesso nativo (Android)** | Expo Modules API (Kotlin) | Plugin Capacitor (Java/Kotlin) |
| **Firebase integration** | `@react-native-firebase` (maduro) | Firebase JS SDK (limitado) |
| **Google Analytics** | GA4 Measurement Protocol (REST) | GA4 Measurement Protocol (REST) |
| **Overlay/Bubble** | Custom Expo Module | Custom Capacitor Plugin |
| **Build system** | EAS Build (CI/CD integrado) | Manual / Capacitor CLI |
| **OTA Updates** | EAS Update (nativo) | Não confiável em WebView apps |
| **Ecossistema** | Enorme (React Native + Expo) | Menor para mobile nativo |
| **Foreground Service** | Expo Module + Config Plugin | Plugin Capacitor customizado |
| **Dev Experience** | Hot reload nativo, TypeScript | Hot reload WebView |

### 1.2 Decisão: **Expo (React Native)**

**Justificativa:**
1. **Rendering nativo** — Performance superior para UI, essencial para a bubble que precisa responder em < 100ms.
2. **Ecossistema maduro** — Firebase Auth, AdMob têm integrações nativas bem mantidas. Google Analytics (GA4) via Measurement Protocol funciona em qualquer plataforma.
3. **Expo Modules API** — Permite criar módulos nativos em Kotlin sem "ejetar" do ecossistema Expo.
4. **Config Plugins** — Automatiza configurações do AndroidManifest sem manutenção manual.
5. **EAS Build** — CI/CD na nuvem, sem necessidade de ambiente Android Studio local para builds.
6. **Padrão do framework** — Seguiremos 100% o padrão Expo, sem hacks ou workarounds.

> [!NOTE]
> Capacitor seria adequado para um app web-first, mas SmartClipboard é fortemente dependente de APIs nativas Android (Overlay, ClipboardManager, Foreground Service), tornando Expo/React Native a escolha superior.

---

## 2. Arquitetura da Aplicação

### 2.1 Visão Geral

```
┌─────────────────────────────────────────────────────┐
│                  CAMADA DE APRESENTAÇÃO              │
│  ┌──────────────┐  ┌──────────────────────────────┐  │
│  │  Bubble UI   │  │      App Principal (Expo)     │  │
│  │  (Native     │  │  ┌────────┐ ┌──────────────┐ │  │
│  │   Android    │  │  │ Screens│ │  Components  │ │  │
│  │   View)      │  │  └────────┘ └──────────────┘ │  │
│  └──────┬───────┘  └──────────────┬───────────────┘  │
│         │                         │                   │
├─────────┴─────────────────────────┴───────────────────┤
│                  CAMADA DE SERVIÇOS                    │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │  Clipboard   │  │  Formatting │  │   Backup     │ │
│  │  Service     │  │  Engine     │  │   Service    │ │
│  └──────────────┘  └─────────────┘  └──────────────┘ │
├────────────────────────────────────────────────────────┤
│                  CAMADA DE DADOS                       │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │  SQLite DB   │  │  KV Store   │  │  SecureStore │ │
│  │  (histórico, │  │  (configs)  │  │  (tokens)    │ │
│  │  favoritos,  │  │             │  │              │ │
│  │  categorias) │  │             │  │              │ │
│  └──────────────┘  └─────────────┘  └──────────────┘ │
├────────────────────────────────────────────────────────┤
│                 CAMADA NATIVA (Android)                │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │  Foreground  │  │  Overlay    │  │  Clipboard   │ │
│  │  Service     │  │  Manager    │  │  Monitor     │ │
│  │  (Kotlin)    │  │  (Kotlin)   │  │  (Kotlin)    │ │
│  └──────────────┘  └─────────────┘  └──────────────┘ │
├────────────────────────────────────────────────────────┤
│                 INTEGRAÇÕES EXTERNAS                   │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────────┐ │
│  │ Firebase │ │ Google   │ │ AdMob  │ │ Google     │ │
│  │ Auth     │ │ Analytics│ │        │ │ Drive API  │ │
│  └──────────┘ └──────────┘ └────────┘ └────────────┘ │
└────────────────────────────────────────────────────────┘
```

### 2.2 Padrão Arquitetural

- **Feature-based structure**: Código organizado por funcionalidade, não por tipo de arquivo.
- **Context API** para estado global (auth, settings, clipboard state).
- **Custom hooks** para lógica de negócio reutilizável.
- **Expo Modules** para bridge com código nativo Kotlin.

---

## 3. Tech Stack

### 3.1 Core

| Tecnologia | Versão | Propósito |
|---|---|---|
| **Expo SDK** | ~52+ (latest stable) | Framework base |
| **React Native** | via Expo SDK | Rendering nativo |
| **TypeScript** | 5.x | Type safety |
| **Expo Router** | v4+ | Navegação (file-based routing) |

### 3.2 Persistência

| Tecnologia | Propósito | Justificativa |
|---|---|---|
| **expo-sqlite** | Banco de dados relacional local | Histórico, favoritos, categorias — parte do Expo SDK |
| **expo-sqlite/kv-store** | Configurações (key-value) | Substitui AsyncStorage, mesma dependência |
| **expo-secure-store** | Tokens e dados sensíveis | Criptografia nativa — parte do Expo SDK |

### 3.3 Integrações (libs de terceiros — criteriosamente selecionadas)

| Biblioteca | Downloads/semana | Última atualização | Propósito | Justificativa |
|---|---|---|---|---|
| **@react-native-firebase/app** | ~500k+ | Semanal | Core Firebase | Padrão da indústria, Google-backed |
| **@react-native-firebase/auth** | ~300k+ | Semanal | Autenticação | Necessário para Google Sign-In nativo |
| **react-native-google-mobile-ads** | ~50k+ | Semanal | AdMob | Mantido pelo time react-native-firebase |
| **@react-native-google-signin/google-signin** | ~200k+ | Quinzenal | Google Sign-In | Necessário para Auth + Drive API |

### 3.4 Módulos Expo (built-in — sem dependências extras)

| Módulo | Propósito |
|---|---|
| **expo-clipboard** | Leitura/escrita do clipboard no JS |
| **expo-notifications** | Notificações do Foreground Service |
| **expo-splash-screen** | Splash screen configurável |
| **expo-font** | Fonts customizadas (se necessário) |
| **expo-haptics** | Feedback tátil |
| **expo-dev-client** | Development builds |

### 3.5 Módulos Nativos Customizados (Expo Modules API)

| Módulo | Linguagem | Propósito |
|---|---|---|
| **smart-clipboard-overlay** | Kotlin | Gerenciar overlay/bubble via WindowManager |
| **smart-clipboard-service** | Kotlin | Foreground Service + Clipboard Monitor |

### 3.6 Bibliotecas NÃO utilizadas (implementação própria)

| Funcionalidade | Motivo de não usar lib |
|---|---|
| **Google Analytics (GA4)** | Measurement Protocol v2 via fetch — sem SDK, sem dependência extra |
| **Formatação de texto** | Lógica simples (toUpperCase, trim, etc.) — implementar nativamente |
| **Gerenciamento de estado** | Context API + useReducer — sem Redux/Zustand |
| **HTTP client** | fetch nativo — sem Axios |
| **Animações da bubble** | React Native Animated API (built-in) |
| **Validação** | Funções utilitárias próprias — sem Yup/Zod |
| **Google Drive API** | REST API direta via fetch — sem SDK wrapper |

---

## 4. Módulos Nativos — Detalhamento

### 4.1 smart-clipboard-overlay (Kotlin)

**Responsabilidade**: Gerenciar o overlay flutuante (bubble) sobre outros apps.

**APIs expostas ao JavaScript:**

```typescript
interface SmartClipboardOverlay {
  // Controle da bubble
  showBubble(): void;
  hideBubble(): void;
  isBubbleVisible(): Promise<boolean>;
  
  // Configuração
  setBubblePosition(x: number, y: number): void;
  setBubbleSize(size: number): void;
  setBubbleOpacity(opacity: number): void;
  
  // Eventos (emitidos para JS)
  onBubbleTap: () => void;
  onBubbleLongPress: () => void;
  onBubbleDragEnd: (x: number, y: number) => void;
  onClipboardChanged: () => void;
}
```

**Implementação Android:**
- Usa `WindowManager.addView()` com `TYPE_APPLICATION_OVERLAY`.
- `LayoutParams` com `FLAG_NOT_FOCUSABLE` para não interceptar toques.
- Touch listener para drag & drop.
- Comunicação com JS via Expo Modules Events.

### 4.2 smart-clipboard-service (Kotlin)

**Responsabilidade**: Foreground Service para manter a bubble ativa e monitorar clipboard.

**APIs expostas ao JavaScript:**

```typescript
interface SmartClipboardService {
  // Controle do serviço
  startService(): Promise<void>;
  stopService(): Promise<void>;
  isServiceRunning(): Promise<boolean>;
  
  // Clipboard
  getClipboardContent(): Promise<string | null>;
  setClipboardContent(text: string): Promise<void>;
  
  // Eventos
  onClipboardChange: (content: string) => void;
}
```

**Implementação Android:**
- Extends `android.app.Service`.
- `startForeground()` com notification channel.
- `ClipboardManager.OnPrimaryClipChangedListener` para detectar mudanças.
- Ao detectar mudança → emite evento para JS + anima bubble.
- Ao usuário tocar bubble → lê clipboard (contexto foreground via overlay) → salva no SQLite.

### 4.3 Config Plugin

```javascript
// plugins/withSmartClipboard.js
// Injeta no AndroidManifest.xml:
// - <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
// - <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
// - <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
// - <service android:name=".SmartClipboardService" 
//           android:foregroundServiceType="specialUse" />
```

---

## 5. Modelo de Dados (SQLite)

### 5.1 Schema

```sql
-- Tabela principal de clips
CREATE TABLE clips (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  content TEXT NOT NULL,
  content_preview TEXT NOT NULL,  -- primeiros 100 chars
  source_app TEXT,                -- pacote do app de origem (se disponível)
  is_favorite INTEGER DEFAULT 0,
  is_pinned INTEGER DEFAULT 0,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  char_count INTEGER NOT NULL,
  word_count INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_used_at TEXT,
  use_count INTEGER DEFAULT 0
);

-- Índices para performance
CREATE INDEX idx_clips_created_at ON clips(created_at DESC);
CREATE INDEX idx_clips_is_favorite ON clips(is_favorite) WHERE is_favorite = 1;
CREATE INDEX idx_clips_is_pinned ON clips(is_pinned) WHERE is_pinned = 1;
CREATE INDEX idx_clips_category_id ON clips(category_id);
CREATE INDEX idx_clips_content ON clips(content);

-- Categorias
CREATE TABLE categories (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#2196F3',
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Templates de texto
CREATE TABLE templates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  use_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Metadados de sincronização
CREATE TABLE sync_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### 5.2 KV Store (Configurações)

```typescript
interface AppSettings {
  // Bubble
  bubble_enabled: boolean;          // default: true
  bubble_size: 'small' | 'medium' | 'large'; // default: 'medium'
  bubble_opacity: number;           // default: 0.9
  bubble_position_x: number;       
  bubble_position_y: number;
  bubble_auto_show_on_copy: boolean; // default: true
  
  // Histórico
  history_max_items: number;        // default: 500
  history_auto_delete_days: number; // default: 0 (never)
  
  // Aparência
  theme: 'light' | 'system';       // default: 'system'
  
  // Sync
  auto_backup_enabled: boolean;    // default: false
  auto_backup_interval: 'daily' | 'weekly'; // default: 'daily'
  last_backup_at: string | null;
  last_sync_at: string | null;
  
  // Misc
  first_launch: boolean;           // default: true
  onboarding_completed: boolean;   // default: false
  analytics_opted_in: boolean;     // default: true
}
```

---

## 6. Estrutura de Diretórios

```
smartClipboard/
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.tsx               # Root layout (providers, fonts)
│   ├── index.tsx                 # Home / Histórico
│   ├── favorites.tsx             # Tela de favoritos
│   ├── categories/
│   │   ├── index.tsx             # Lista de categorias
│   │   └── [id].tsx              # Detalhes da categoria
│   ├── settings/
│   │   ├── index.tsx             # Configurações gerais
│   │   ├── bubble.tsx            # Config da bubble
│   │   ├── backup.tsx            # Backup & Sync
│   │   └── account.tsx           # Conta & Auth
│   ├── editor/
│   │   └── [id].tsx              # Editor de texto
│   └── onboarding.tsx            # Tela de primeiro uso
│
├── components/                   # Componentes reutilizáveis
│   ├── ui/                       # Componentes base (Button, Card, Input, etc.)
│   ├── clip/                     # Componentes de clip (ClipCard, ClipList, etc.)
│   ├── editor/                   # Componentes do editor de texto
│   └── common/                   # Header, SearchBar, EmptyState, etc.
│
├── contexts/                     # React Contexts
│   ├── AuthContext.tsx
│   ├── ClipboardContext.tsx
│   └── SettingsContext.tsx
│
├── hooks/                        # Custom hooks
│   ├── useClipboard.ts
│   ├── useDatabase.ts
│   ├── useSettings.ts
│   ├── useBackup.ts
│   └── useFormatting.ts
│
├── services/                     # Serviços / lógica de negócio
│   ├── database.ts               # SQLite operations
│   ├── formatting.ts             # Text formatting functions
│   ├── backup.ts                 # Google Drive backup
│   ├── analytics.ts              # Analytics wrapper
│   └── ads.ts                    # AdMob wrapper
│
├── modules/                      # Expo native modules
│   ├── smart-clipboard-overlay/
│   │   ├── android/
│   │   │   └── src/main/java/
│   │   │       └── expo/modules/smartclipboardoverlay/
│   │   │           ├── SmartClipboardOverlayModule.kt
│   │   │           ├── BubbleService.kt
│   │   │           └── BubbleView.kt
│   │   ├── index.ts
│   │   └── expo-module.config.json
│   │
│   └── smart-clipboard-service/
│       ├── android/
│       │   └── src/main/java/
│       │       └── expo/modules/smartclipboardservice/
│       │           ├── SmartClipboardServiceModule.kt
│       │           ├── ClipboardForegroundService.kt
│       │           └── ClipboardMonitor.kt
│       ├── index.ts
│       └── expo-module.config.json
│
├── plugins/                      # Expo config plugins
│   └── withSmartClipboard.js     # Manifest modifications
│
├── utils/                        # Utilitários
│   ├── constants.ts
│   ├── colors.ts                 # Design tokens
│   ├── typography.ts             # Font styles
│   └── validators.ts
│
├── types/                        # TypeScript types
│   ├── clip.ts
│   ├── category.ts
│   ├── template.ts
│   └── settings.ts
│
├── assets/                       # Imagens, ícones, fonts
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── app.json                      # Expo config
├── tsconfig.json
├── package.json
├── PRD.md
├── SPECS.md
├── AGENTS.md
└── TASKS.md
```

---

## 7. Integrações — Detalhamento

### 7.1 Firebase Auth

**Fluxo de autenticação:**
```
1. App inicia → verifica estado de auth (onAuthStateChanged)
2. Se não autenticado → app funciona em modo local (sem sync)
3. Usuário vai em Configurações > Conta > Login com Google
4. GoogleSignIn → Firebase Auth (credential)
5. Token armazenado em expo-secure-store
6. Funcionalidades de sync/backup desbloqueadas
```

**Configuração:**
- `google-services.json` na raiz do projeto.
- Config plugin `@react-native-firebase/app` em `app.json`.
- Firebase project no Console com SHA-1 do app.

### 7.2 Google Analytics 4 (GA4) — Measurement Protocol v2

**Integração**: REST API direta via `fetch` — sem dependência de SDK.

**Configuração:**
- Criar propriedade GA4 no Google Analytics Console.
- Obter `measurement_id` (formato: `G-XXXXXXXXXX`) e `api_secret`.
- Armazenar `api_secret` via variável de ambiente (não commitar).
- Endpoint: `POST https://www.google-analytics.com/mp/collect?measurement_id={id}&api_secret={secret}`

**Client ID:**
- Gerar UUID único por instalação do app (persistido no KV Store).
- Usar como `client_id` em todas as requisições.

**Implementação (services/analytics.ts):**
```typescript
interface GA4Event {
  name: string;
  params?: Record<string, string | number>;
}

async function trackEvent(event: GA4Event): Promise<void> {
  // Respeitar opt-in do usuário
  // Enfileirar eventos offline para envio posterior
  // Enviar via fetch para Measurement Protocol endpoint
}
```

**Eventos trackados:**

| Evento | Parâmetros | Quando |
|---|---|---|
| `clip_captured` | `source`, `char_count` | Texto capturado via bubble |
| `clip_pasted` | `clip_id`, `from_bubble` | Texto colado pelo app |
| `clip_edited` | `clip_id`, `edit_type` | Texto editado |
| `clip_favorited` | `clip_id` | Texto favoritado |
| `bubble_opened` | — | Bubble expandida |
| `bubble_closed` | — | Bubble recolhida |
| `formatting_used` | `format_type` | Formatação aplicada |
| `backup_created` | `item_count`, `size_bytes` | Backup realizado |
| `backup_restored` | `item_count` | Backup restaurado |
| `search_performed` | `query_length`, `results_count` | Busca realizada |
| `category_created` | — | Categoria criada |
| `onboarding_completed` | `step_count` | Onboarding finalizado |
| `ad_impression` | `ad_type`, `placement` | Anúncio exibido |
| `app_open` | `session_count` | App aberto |
| `app_error` | `error_type`, `message` | Erro capturado |

**Offline Queue:**
- Eventos são enfileirados localmente (SQLite) quando offline.
- Ao restaurar conexão, fila é drenada em lotes (max 25 eventos por request, limite do Measurement Protocol).

### 7.3 AdMob

**Placements:**

| Tipo | Placement | Tela | Frequência |
|---|---|---|---|
| Banner | `home_bottom_banner` | Home / Histórico | Sempre visível |
| Intersticial | `app_open_interstitial` | Ao abrir o app | Max 1x / 3 min |

**Regras:**
- Nunca exibir ads na bubble/overlay.
- Intersticial nunca após ação do usuário (apenas ao abrir app).
- Respeitar `analytics_opted_in` do usuário.
- Test Ad IDs durante desenvolvimento.

### 7.4 Google Drive API

**Estratégia de Backup:**
```
1. Serializar clips + categories + templates → JSON
2. Comprimir (gzip)
3. Upload para Google Drive AppData folder (hidden)
4. Formato: smartclipboard_backup_{timestamp}.json.gz
```

**Estratégia de Sync (v1 — simplificada):**
- Sync manual + auto-backup periódico.
- Não há merge de conflitos — último backup sobrescreve.
- Merge inteligente planejado para v2.0.

**Implementação:**
- REST API direta do Google Drive (sem SDK extra).
- Scope: `https://www.googleapis.com/auth/drive.appdata`.
- Auth token obtido via Google Sign-In.

---

## 8. Fluxo de Captura de Clipboard

```
┌──────────────────────────────────────────────────────────────┐
│                      FLUXO DE CAPTURA                         │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Usuário copia texto em qualquer app                       │
│           │                                                    │
│           ▼                                                    │
│  2. ClipboardMonitor (Foreground Service) detecta mudança     │
│     via OnPrimaryClipChangedListener                          │
│           │                                                    │
│           ▼                                                    │
│  3. Bubble recebe notificação e exibe animação de pulse       │
│     (indica novo conteúdo disponível)                         │
│           │                                                    │
│           ▼                                                    │
│  4. Usuário toca na bubble                                    │
│           │                                                    │
│           ▼                                                    │
│  5. Overlay ganha foco → ClipboardManager.getPrimaryClip()    │
│     lê o conteúdo (agora em contexto foreground)              │
│           │                                                    │
│           ▼                                                    │
│  6. Conteúdo salvo no SQLite + exibido no painel expandido    │
│           │                                                    │
│           ▼                                                    │
│  7. Usuário pode: colar direto, editar, favoritar, ou         │
│     recolher a bubble para usar depois                        │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. Permissões Android

| Permissão | Propósito | Tipo |
|---|---|---|
| `SYSTEM_ALERT_WINDOW` | Exibir bubble sobre outros apps | Especial (Settings) |
| `FOREGROUND_SERVICE` | Manter serviço rodando com notificação | Normal |
| `FOREGROUND_SERVICE_SPECIAL_USE` | Tipo de foreground service (API 34+) | Normal |
| `INTERNET` | Firebase Auth, Google Analytics, Google Drive, AdMob | Normal |
| `POST_NOTIFICATIONS` | Notificações do service (API 33+) | Runtime |
| `RECEIVE_BOOT_COMPLETED` | Reiniciar service após boot (futuro) | Normal |

**Fluxo de permissões:**
1. `SYSTEM_ALERT_WINDOW` → solicitada no onboarding com explicação clara.
2. `POST_NOTIFICATIONS` → solicitada ao ativar o serviço (API 33+).
3. Demais → declaradas no manifest (automáticas).

---

## 10. Segurança

| Aspecto | Implementação |
|---|---|
| **Auth tokens** | `expo-secure-store` (Keystore Android) |
| **Dados locais** | SQLite sem criptografia (v1) — dados não sensíveis |
| **Comunicação** | HTTPS only (Firebase, Google Analytics, Drive) |
| **Backup** | Criptografia em trânsito (TLS). Em repouso no Drive (criptografia Google). |
| **Privacidade** | Conteúdo do clipboard NUNCA enviado a servidores nossos. Apenas Drive do próprio usuário. |
| **LGPD** | Política de privacidade. Opt-in para analytics. Exclusão de dados mediante solicitação. |

---

## 11. Performance

### 11.1 Targets

| Métrica | Target |
|---|---|
| Cold start (app) | < 2s |
| Bubble tap → painel aberto | < 100ms |
| Busca no histórico (500 itens) | < 200ms |
| Salvar clip no SQLite | < 50ms |
| Consumo de RAM (service idle) | < 30MB |
| Consumo de bateria | Imperceptível no uso normal |

### 11.2 Otimizações

- **FlatList** com `windowSize` otimizado para listas de clips.
- **SQLite queries** com índices e paginação (LIMIT/OFFSET).
- **Foreground Service** com `WakeLock` mínimo (apenas clipboard listener).
- **Bubble View** renderizada nativamente (não via React Native) para máxima responsividade.
- **Lazy loading** de módulos e telas.
- **Memoização** agressiva com `useMemo` e `useCallback`.

---

## 12. Testing Strategy

| Tipo | Ferramenta | Cobertura |
|---|---|---|
| **Unit Tests** | Jest | Serviços, utils, formatação |
| **Component Tests** | React Native Testing Library | Componentes UI |
| **Integration Tests** | Detox (futuro) | Fluxos completos |
| **Native Module Tests** | Android instrumented tests | Módulos Kotlin |
| **Manual Testing** | Development build no device | Bubble, overlay, permissões |

---

## 13. Build & Deploy

### 13.1 Desenvolvimento

```bash
# Instalar dependências
npm install

# Prebuild (gerar projeto Android nativo)
npx expo prebuild --platform android

# Rodar development build
npx expo run:android

# Ou via EAS
eas build --platform android --profile development
```

### 13.2 Produção

```bash
# Build de produção via EAS
eas build --platform android --profile production

# Submit para Play Store
eas submit --platform android
```

### 13.3 Profiles (eas.json)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## 14. Dependências — Resumo Final

### Dependências de produção (mínimas):

| Pacote | Tipo |
|---|---|
| `expo` | Core |
| `expo-router` | Core |
| `expo-sqlite` | Core Expo |
| `expo-secure-store` | Core Expo |
| `expo-clipboard` | Core Expo |
| `expo-notifications` | Core Expo |
| `expo-haptics` | Core Expo |
| `expo-splash-screen` | Core Expo |
| `expo-font` | Core Expo |
| `expo-dev-client` | Dev |
| `@react-native-firebase/app` | 3rd party |
| `@react-native-firebase/auth` | 3rd party |
| `react-native-google-mobile-ads` | 3rd party |
| `@react-native-google-signin/google-signin` | 3rd party |

**Total de libs de terceiros: 4** (todas Google-backed, amplamente utilizadas, frequentemente atualizadas).

> [!NOTE]
> **Google Analytics (GA4)** é integrado via Measurement Protocol v2 (REST API direta com `fetch`), sem necessidade de SDK ou lib adicional. Isso reduz dependências e mantém controle total sobre os dados enviados.
