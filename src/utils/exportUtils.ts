
import * as XLSX from 'xlsx';
import { Expense, BudgetSummary } from '../types/budget';

// Função para formatar data
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

// Traduz categorias para português
const translateCategory = (category: string): string => {
  switch (category) {
    case 'necessity':
      return 'Necessidade';
    case 'want':
      return 'Desejo';
    case 'saving':
      return 'Poupança';
    default:
      return category;
  }
};

// Exporta despesas para Excel
export const exportExpensesToExcel = (expenses: Expense[], summary: BudgetSummary) => {
  // Preparar dados das despesas
  const expensesData = expenses.map(expense => ({
    'Data': formatDate(expense.date),
    'Descrição': expense.description,
    'Categoria': translateCategory(expense.category),
    'Valor': expense.amount,
  }));

  // Preparar dados do resumo financeiro
  const summaryData = [
    { 'Item': 'Renda Mensal', 'Valor': summary.totalIncome },
    { 'Item': 'Total Gasto', 'Valor': summary.totalSpent },
    { 'Item': 'Disponível', 'Valor': summary.totalRemaining },
    { 'Item': 'Alocação - Necessidades (50%)', 'Valor': summary.allocations.necessity },
    { 'Item': 'Alocação - Desejos (30%)', 'Valor': summary.allocations.want },
    { 'Item': 'Alocação - Poupança (20%)', 'Valor': summary.allocations.saving },
    { 'Item': 'Gasto - Necessidades', 'Valor': summary.spent.necessity },
    { 'Item': 'Gasto - Desejos', 'Valor': summary.spent.want },
    { 'Item': 'Gasto - Poupança', 'Valor': summary.spent.saving },
    { 'Item': 'Restante - Necessidades', 'Valor': summary.remaining.necessity },
    { 'Item': 'Restante - Desejos', 'Valor': summary.remaining.want },
    { 'Item': 'Restante - Poupança', 'Valor': summary.remaining.saving },
  ];

  // Criar uma nova planilha
  const wb = XLSX.utils.book_new();
  
  // Adicionar dados das despesas
  const wsExpenses = XLSX.utils.json_to_sheet(expensesData);
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Despesas');
  
  // Adicionar resumo financeiro
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo');

  // Definir o nome do arquivo
  const fileName = `Orçamento_50-30-20_${new Date().toISOString().slice(0, 10)}.xlsx`;
  
  // Exportar arquivo
  XLSX.writeFile(wb, fileName);
};
