
export type ExpenseCategory = 'necessity' | 'want' | 'saving';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
}

export interface BudgetAllocation {
  necessity: number; // 50%
  want: number;      // 30%
  saving: number;    // 20%
}

export interface BudgetSummary {
  totalIncome: number;
  allocations: BudgetAllocation;
  spent: {
    necessity: number;
    want: number;
    saving: number;
  };
  remaining: {
    necessity: number;
    want: number;
    saving: number;
  };
  totalSpent: number;
  totalRemaining: number;
}
