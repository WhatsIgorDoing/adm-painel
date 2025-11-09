# Painel Administrativo de Pedidos

Interface web para monitorar e administrar pedidos de logística premium. O projeto oferece uma visão consolidada da operação, permitindo filtrar pedidos rapidamente, exportar relatórios e inspecionar cada caso em profundidade.

## Principais recursos
- Tabela virtualizada com ordenação multi-coluna, seleção em massa e ações contextuais para cada pedido (`src/components/OrdersTable.tsx`).
- Busca, filtros combináveis, chips de estado, filtros salvos e seleção rápida de períodos (`src/pages/OrdersPage.tsx`).
- Exportação dos dados filtrados para CSV, XLSX ou JSON, impressão e fluxo de criação de pedidos via drawer (`src/utils/exporters.ts`, `src/components/CreateOrderForm.tsx`).
- Tela de detalhes com status, linha do tempo, logística, billing e notas consolidadas (`src/pages/OrderDetailPage.tsx`).
- Dados fictícios centralizados em `src/data/orders.ts` facilitam demonstrações e testes offline.

## Stack
- React 18 + Vite + TypeScript
- Tailwind CSS para estilização utilitária
- Headless UI e Heroicons para componentes acessíveis
- TanStack Table + TanStack Virtual para listar grandes volumes
- React Router para navegação SPA

## Como executar
1. **Requisitos**: Node.js 18+ e npm (ou pnpm/yarn configurado).
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Suba o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Para gerar o build de produção:
   ```bash
   npm run build
   ```
5. Opcional — pré-visualizar o build:
   ```bash
   npm run preview
   ```

## Estrutura rápida
- `src/pages`: telas principais (lista de pedidos e detalhes).
- `src/components`: layout, tabela, filtros, formulários e utilidades de UI.
- `src/utils`: filtros, exportadores e helpers de status.
- `src/data`: fixtures de pedidos usados na interface.

Sinta-se à vontade para adaptar os dados, estilos ou integrações conforme o backend evoluir.
