# SmartClipboard — Product Requirements Document (PRD)

> **Versão:** 1.0  
> **Data:** 2026-04-03  
> **Status:** Rascunho — Aguardando aprovação

---

## 1. Visão do Produto

O **SmartClipboard** é um aplicativo Android que oferece gerenciamento inteligente e refinado de tudo o que é copiado no dispositivo. Através de um botão flutuante (bubble/overlay), o usuário tem acesso instantâneo ao histórico de cópias, ferramentas de formatação, edição e seleção de textos antes de colar — tudo sem sair do aplicativo em uso.

### 1.1 Problema

- O Android nativo oferece apenas uma cópia por vez no clipboard, sem histórico persistente.
- Teclados como Gboard possuem clipboard limitado (auto-limpeza, sem organização, sem formatação).
- Não existe solução nativa para editar/formatar texto antes de colar.
- Textos importantes copiados são facilmente perdidos.

### 1.2 Solução

Um app que:
- Captura automaticamente tudo que é copiado (quando o app está em primeiro plano ou via interação com a bubble).
- Persiste o histórico de cópias localmente.
- Oferece acesso rápido via overlay flutuante (bubble) sobre qualquer app.
- Permite edição, formatação e seleção do texto a ser colado.
- Organiza textos com favoritos e categorias.
- Sincroniza e faz backup via Google Drive.

---

## 2. Público-Alvo

| Segmento | Descrição |
|---|---|
| **Profissionais** | Pessoas que trabalham com textos, emails, mensagens — copiam e colam frequentemente. |
| **Estudantes** | Quem compila anotações, citações e trechos de estudo. |
| **Desenvolvedores** | Quem copia snippets de código, comandos e URLs frequentemente. |
| **Usuários avançados** | Qualquer pessoa que sente falta de um gerenciador de clipboard robusto no Android. |

---

## 3. User Stories

### 3.1 Captura & Histórico

| ID | Como... | Eu quero... | Para que... |
|---|---|---|---|
| US-01 | Usuário | que o app capture automaticamente o que copio quando interajo com a bubble | eu não perca textos copiados |
| US-02 | Usuário | ver o histórico de tudo que copiei | eu possa reutilizar textos anteriores |
| US-03 | Usuário | pesquisar no meu histórico de cópias | eu encontre rapidamente um texto específico |
| US-04 | Usuário | que o histórico persista após reiniciar o celular | eu não perca dados |
| US-05 | Usuário | limpar itens individuais ou todo o histórico | eu tenha controle sobre meus dados |

### 3.2 Bubble (Overlay Flutuante)

| ID | Como... | Eu quero... | Para que... |
|---|---|---|---|
| US-06 | Usuário | um botão flutuante sempre acessível sobre outros apps | eu tenha acesso rápido ao clipboard |
| US-07 | Usuário | tocar na bubble e ver meus textos recentes | eu escolha qual texto colar |
| US-08 | Usuário | arrastar a bubble pela tela | ela não atrapalhe meu uso do celular |
| US-09 | Usuário | expandir a bubble em um painel de formatação | eu edite o texto antes de colar |
| US-10 | Usuário | configurar a aparência e comportamento da bubble | ela se adapte ao meu uso |

### 3.3 Edição & Formatação

| ID | Como... | Eu quero... | Para que... |
|---|---|---|---|
| US-11 | Usuário | editar um texto copiado antes de colar | eu corrija ou ajuste informações |
| US-12 | Usuário | aplicar transformações (MAIÚSCULAS, minúsculas, Título) | eu formate rapidamente |
| US-13 | Usuário | remover espaços extras, quebras de linha | eu limpe o texto |
| US-14 | Usuário | combinar múltiplos textos copiados em um só | eu crie textos compostos |
| US-15 | Usuário | usar templates/modelos de texto | eu reutilize formatos recorrentes |

### 3.4 Organização

| ID | Como... | Eu quero... | Para que... |
|---|---|---|---|
| US-16 | Usuário | favoritar textos importantes | eu os acesse rapidamente |
| US-17 | Usuário | criar categorias/tags para meus textos | eu os organize logicamente |
| US-18 | Usuário | fixar textos no topo da lista | eu encontre os mais usados rapidamente |

### 3.5 Sincronização & Backup

| ID | Como... | Eu quero... | Para que... |
|---|---|---|---|
| US-19 | Usuário | fazer backup dos meus dados no Google Drive | eu não perca dados se trocar de celular |
| US-20 | Usuário | restaurar meus dados de um backup | eu recupere meus textos |
| US-21 | Usuário | sincronizar automaticamente meus dados | eu tenha sempre a versão mais recente |

### 3.6 Autenticação & Conta

| ID | Como... | Eu quero... | Para que... |
|---|---|---|---|
| US-22 | Usuário | me autenticar com minha conta Google | eu acesse de forma segura |
| US-23 | Usuário | usar o app sem login para funcionalidades básicas | eu não seja obrigado a criar conta |
| US-24 | Usuário | que meus dados fiquem vinculados à minha conta | eu os recupere em outro dispositivo |

---

## 4. Funcionalidades — Escopo MVP (v1.0)

### 4.1 Core Features

| Feature | Prioridade | Descrição |
|---|---|---|
| **Clipboard Capture** | P0 | Captura de texto copiado via interação com a bubble/overlay |
| **Histórico de Clipboard** | P0 | Lista persistente de todos os textos capturados |
| **Bubble/Overlay** | P0 | Botão flutuante com painel expansível para acesso rápido |
| **Busca no Histórico** | P0 | Pesquisa por texto no histórico de cópias |
| **Edição Pré-Colagem** | P0 | Editar texto antes de copiar/colar |
| **Transformações de Texto** | P1 | Uppercase, lowercase, capitalize, trim, etc. |
| **Favoritos** | P1 | Marcar e acessar textos favoritos |
| **Fixar Texto** | P1 | Pin de textos frequentes no topo |
| **Categorias/Tags** | P2 | Organização por categorias customizáveis |
| **Templates** | P2 | Modelos de texto reutilizáveis |
| **Combinar Textos** | P2 | Merge de múltiplos itens do clipboard |

### 4.2 Integrações

| Integração | Prioridade | Uso |
|---|---|---|
| **Firebase Auth** | P0 | Autenticação com conta Google |
| **Google Analytics (GA4)** | P0 | Métricas de uso, eventos, funis — via Measurement Protocol (REST API) |
| **AdMob** | P1 | Monetização via anúncios (banner + intersticial) |
| **Google Drive** | P1 | Backup e sincronização de dados do usuário |

### 4.3 Infraestrutura

| Feature | Prioridade | Descrição |
|---|---|---|
| **Persistência Local (SQLite)** | P0 | Banco local para histórico e dados |
| **Persistência de Config** | P0 | Configurações do app via key-value store |
| **Foreground Service** | P0 | Serviço para manter a bubble ativa |
| **Permissões** | P0 | SYSTEM_ALERT_WINDOW, FOREGROUND_SERVICE |

---

## 5. Funcionalidades Futuras (Pós-MVP)

| Feature | Fase | Descrição |
|---|---|---|
| Sincronização via serviço próprio (pago) | v2.0 | Substituir Google Drive por backend próprio |
| Planos de assinatura | v2.0 | Modelo freemium com funcionalidades premium |
| Reconhecimento de tipos de conteúdo | v2.0 | Detectar URLs, emails, telefones, endereços |
| Ações inteligentes por tipo | v2.0 | Abrir URL, ligar, enviar email automaticamente |
| Suporte a imagens/mídia | v3.0 | Gerenciar imagens copiadas |
| Versão iOS | v3.0 | Expandir para plataforma Apple |
| Widget na home | v2.0 | Acesso rápido a textos favoritos/recentes |

---

## 6. Monetização

### 6.1 Modelo — Freemium + Ads

| Tier | Limites | Ads |
|---|---|---|
| **Free** | Histórico limitado a 50 itens, 3 categorias, 5 favoritos | Banner + intersticial ocasional |
| **Premium** (futuro) | Histórico ilimitado, categorias ilimitadas, templates, sync | Sem ads |

### 6.2 Posicionamento de Ads (AdMob)

- **Banner**: Rodapé da tela principal do app (não na bubble).
- **Intersticial**: Exibido ao abrir o app (não mais que 1x a cada 3 minutos). Nunca durante operação na bubble.
- **Rewarded** (futuro): Assistir ad para desbloquear funcionalidade premium temporariamente.

> **Regra de ouro**: Ads NUNCA devem interromper a experiência na bubble/overlay. Anúncios apenas dentro do app principal.

---

## 7. Restrições e Limitações Conhecidas

### 7.1 Restrições do Android

> [!WARNING]
> **Clipboard em Background**: A partir do Android 10 (API 29), o Android restringe o acesso ao clipboard em background. Apenas o app em primeiro plano ou o teclado ativo podem ler o clipboard.

**Estratégia de captura**:
1. O Foreground Service mantém a bubble ativa e registra um `ClipboardManager.OnPrimaryClipChangedListener`.
2. Quando o listener detecta mudança no clipboard, a bubble exibe uma indicação visual (pulso/animação).
3. O usuário toca na bubble → a bubble ganha foco (foreground) → o app lê o conteúdo do clipboard.
4. Alternativamente, o texto é capturado ao abrir manualmente o app.

### 7.2 Auto-Clear do Android 13+

- Android 13 limpa o clipboard automaticamente após ~1 hora.
- A estratégia de captura via bubble mitiga isso, pois o usuário captura ativamente após copiar.

### 7.3 Toast de Acesso ao Clipboard (Android 12+)

- O sistema exibe toast "App colou do seu clipboard" — inevitável e aceitável. Reforça a transparência.

---

## 8. Compatibilidade

| Requisito | Valor |
|---|---|
| **Plataforma** | Android |
| **SDK Mínimo** | API 26 (Android 8.0) — Suporte a Notification Channels e Foreground Service |
| **SDK Alvo** | API 34+ (Android 14+) |
| **Overlay/Bubble** | `SYSTEM_ALERT_WINDOW` — disponível desde API 23 |
| **Cobertura estimada** | ~95%+ dos dispositivos Android ativos |

> [!IMPORTANT]
> **Decisão pendente**: O usuário mencionou "versão em que surgiu o recurso bubble". Se se refere ao **Android Bubble API** (API 30 / Android 11), o SDK mínimo seria API 30. Se se refere ao **conceito de overlay flutuante** (custom), podemos usar API 26. **A recomendação é API 26 com overlay custom**, pois o Bubble API nativo é limitado a notificações de conversa e não atende ao caso de uso de clipboard manager.

---

## 9. Métricas de Sucesso (KPIs)

| Métrica | Meta (3 meses pós-launch) |
|---|---|
| Downloads | 5.000+ |
| DAU (Daily Active Users) | 1.000+ |
| Retenção D7 | > 40% |
| Retenção D30 | > 25% |
| Textos capturados/dia/usuário | > 10 |
| Uso da bubble/dia/usuário | > 5 interações |
| Avaliação Play Store | > 4.2 ★ |
| Receita AdMob (mensal) | Crescimento consistente MoM |

---

## 10. Design & UX

### 10.1 Identidade Visual

- **Paleta**: Tons de azul (primário) e branco (fundo).
  - Azul primário: `#1565C0` (Material Blue 800)
  - Azul escuro: `#0D47A1` (Material Blue 900)
  - Azul claro: `#42A5F5` (Material Blue 400)
  - Azul accent: `#2196F3` (Material Blue 500)
  - Branco: `#FFFFFF`
  - Cinza claro: `#F5F7FA` (backgrounds)
  - Cinza texto: `#546E7A`
- **Tipografia**: Inter ou Roboto (fonts nativas do Android).
- **Estilo**: Material Design 3, clean, minimalista.

### 10.2 Princípios de UX

1. **Velocidade**: A bubble deve responder em < 100ms.
2. **Simplicidade**: Máximo 2 toques para colar um texto do histórico.
3. **Não-intrusivo**: A bubble nunca deve bloquear conteúdo. Deve ser arrastável.
4. **Feedback visual**: Animações sutis para confirmar ações (copiar, favoritar, deletar).
5. **Acessibilidade**: Suporte a tamanhos de fonte do sistema, contraste adequado.

### 10.3 Telas do App Principal

1. **Home / Histórico**: Lista de textos capturados (mais recentes primeiro).
2. **Favoritos**: Textos marcados como favorito.
3. **Categorias**: Organização por tags/categorias.
4. **Configurações**: Preferências do app, conta, backup, aparência da bubble.
5. **Templates** (P2): Modelos de texto salvos.

### 10.4 Bubble/Overlay

1. **Estado Recolhido**: Ícone circular flutuante (~48dp), arrastável.
2. **Estado Expandido**: Painel compacto com:
   - Lista dos últimos 5-10 textos.
   - Botão de busca.
   - Ações rápidas (copiar, editar, favoritar).
   - Barra de formatação (quando um texto é selecionado).
3. **Animações**: Expandir/recolher com transição suave. Pulse ao detectar nova cópia.

---

## 11. Requisitos Não-Funcionais

| Requisito | Especificação |
|---|---|
| **Performance** | App principal carrega em < 2s. Bubble responde em < 100ms. |
| **Consumo de bateria** | Foreground service otimizado. Uso mínimo de CPU em idle. |
| **Armazenamento** | Histórico com limite configurável (padrão 500 itens). |
| **Segurança** | Tokens armazenados em SecureStore. Dados locais em SQLite sem criptografia (v1), com opção de criptografia futura. |
| **Privacidade** | Cumprir LGPD. Não enviar conteúdo do clipboard para servidores (exceto backup explícito pelo usuário). |
| **Offline** | 100% funcional offline (exceto backup/sync). |
| **Estabilidade** | Crash rate < 1%. ANR rate < 0.5%. |

---

## 12. Glossário

| Termo | Definição |
|---|---|
| **Bubble** | Botão flutuante (overlay) que aparece sobre outros aplicativos. |
| **Overlay** | Visualização que aparece sobre a interface de outros apps. |
| **Foreground Service** | Serviço Android que roda com notificação visível ao usuário. |
| **Clipboard** | Área de transferência do sistema para copiar/colar. |
| **SYSTEM_ALERT_WINDOW** | Permissão Android para exibir conteúdo sobre outros apps. |
| **P0/P1/P2** | Prioridades: P0 = essencial para MVP, P1 = importante, P2 = desejável. |
