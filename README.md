# SmartClipboard

Um gerenciador de clipboard para Android com foco em produtividade. Apresenta uma bolha flutuante nativa para acessar recursos rápidos de formatação e colagem. Diferente de outros apps, mantém seus dados localmente com foco em privacidade.

## Fases de Desenvolvimento

Consulte `TASKS.md` para visualizar o cronograma e o andamento geral das tarefas. As especificações de arquitetura estão no `SPECS.md`, e os requisitos de produto no `PRD.md`. Todos definidos conforme papéis do `AGENTS.md`.

## Em Execução

O projeto atual foi inicializado com a configuração básica do Expo e as dependências e infra-estrutura descritos na **Fase 1**.

### Setup Local

1. Instale dependências:
   ```bash
   npm install
   ```

2. Crie uma build de desenvolvimento Android (requer EAS CLI):
   ```bash
   npx expo prebuild --platform android
   npx expo run:android
   ```
